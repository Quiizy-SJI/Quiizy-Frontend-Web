import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
	AlertComponent,
	ButtonComponent,
	CardComponent,
	InputComponent,
	SpinnerComponent,
} from '../../../components/ui';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStoreService } from '../../../core/auth/auth-store.service';
import {
	StudentChatReply,
	StudentChatService,
} from '../../../services/student-chat.service';

type ChatRole = 'assistant' | 'student';

interface ChatMessage {
	id: number;
	role: ChatRole;
	text: string;
	createdAt: Date;
	language?: string;
}

const STORAGE_PREFIX = 'quizzy_chat_';

function createDefaultMessage(id: number): ChatMessage {
	return {
		id,
		role: 'assistant',
		text: 'Hello! I am your Quizzy AI assistant. Ask me about your class, semester, courses, teachers, or exams.',
		createdAt: new Date(),
	};
}

@Component({
	selector: 'app-ai-chat',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatIconModule,
		AlertComponent,
		ButtonComponent,
		CardComponent,
		InputComponent,
		SpinnerComponent,
	],
	templateUrl: './ai-chat.component.html',
	styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
	private readonly authService = inject(AuthService);
	private readonly authStore = inject(AuthStoreService);
	private readonly chatService = inject(StudentChatService);
	private readonly router = inject(Router);

	private messageId = 1;

	private readonly thinkingPhrases = [
		'Assistant is thinking...',
		'Analyzing your context...',
		'Generating your response...',
		'Processing your question...',
		'Almost there...',
	];

	private thinkingInterval: ReturnType<typeof setInterval> | null = null;

	readonly session = toSignal(this.authStore.session$, { initialValue: null });

	private readonly userId = computed(() => this.session()?.user?.id ?? null);

	private readonly storageKey = computed(() =>
		this.userId() ? `${STORAGE_PREFIX}${this.userId()}` : null,
	);

	readonly prompt = signal('');
	readonly isSending = signal(false);
	readonly isLoggingOut = signal(false);
	readonly errorMessage = signal('');
	readonly thinkingMessage = signal('');

	readonly canSend = computed(
		() => !this.isSending() && this.prompt().trim().length > 0,
	);

	readonly studentName = computed(() => {
		const user = this.session()?.user;
		if (!user) return 'Student';

		const fullName = `${user.name ?? ''} ${user.surname ?? ''}`.trim();
		return fullName || user.email || 'Student';
	});

	readonly hasMessages = computed(() => this.messages().length > 0);

	readonly messages = signal<ChatMessage[]>([]);

	constructor() {
		this.loadFromStorage();

		effect((onCleanup) => {
			const msgs = this.messages();
			const id = setTimeout(() => this.saveToStorage(msgs), 200);
			onCleanup(() => clearTimeout(id));
		});
	}

	async sendMessage(): Promise<void> {
		const question = this.prompt().trim();
		if (!question || this.isSending()) return;

		this.errorMessage.set('');
		this.messages.update((m) => [
			...m,
			{
				id: this.nextMessageId(),
				role: 'student',
				text: question,
				createdAt: new Date(),
			},
		]);
		this.prompt.set('');
		this.isSending.set(true);
		this.startThinkingAnimation();

		try {
			const reply = await firstValueFrom(
				this.chatService.askQuestion(question),
			);
			this.messages.update((m) => [
				...m,
				{
					id: this.nextMessageId(),
					role: 'assistant',
					text: reply.answer,
					createdAt: new Date(reply.generatedAt),
					language: reply.detectedLanguage,
				},
			]);
		} catch (error: unknown) {
			this.errorMessage.set(this.getErrorMessage(error));
		} finally {
			this.isSending.set(false);
			this.stopThinkingAnimation();
		}
	}

	async logout(): Promise<void> {
		if (this.isLoggingOut()) return;

		this.isLoggingOut.set(true);
		this.errorMessage.set('');

		try {
			await firstValueFrom(this.authService.logout());
		} catch {
			// Local logout still happens through auth service finalize logic.
		} finally {
			this.isLoggingOut.set(false);
			await this.router.navigateByUrl('/login');
		}
	}

	clearChat(): void {
		this.messages.set([createDefaultMessage(this.nextMessageId())]);
	}

	private loadFromStorage(): void {
		const key = this.storageKey();

		if (!key) {
			this.messages.set([createDefaultMessage(this.nextMessageId())]);
			return;
		}

		try {
			const raw = localStorage.getItem(key);
			if (raw) {
				const parsed: ChatMessage[] = JSON.parse(raw, (_, value) =>
					typeof value === 'string' &&
					/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
						? new Date(value)
						: value,
				);

				if (Array.isArray(parsed) && parsed.length > 0) {
					const maxId = parsed.reduce((max, m) => Math.max(max, m.id), 0);
					this.messageId = maxId + 1;
					this.messages.set(parsed);
					return;
				}
			}
		} catch {
			// Corrupt storage — reset
		}

		this.messages.set([createDefaultMessage(this.nextMessageId())]);
	}

	private saveToStorage(msgs: ChatMessage[]): void {
		const key = this.storageKey();
		if (!key) return;

		try {
			localStorage.setItem(key, JSON.stringify(msgs));
		} catch {
			// Storage full or unavailable
		}
	}

	private startThinkingAnimation(): void {
		let phraseIndex = 0;
		this.thinkingMessage.set(this.thinkingPhrases[0]);

		this.thinkingInterval = setInterval(() => {
			phraseIndex = (phraseIndex + 1) % this.thinkingPhrases.length;
			this.thinkingMessage.set(this.thinkingPhrases[phraseIndex]);
		}, 1200);
	}

	private stopThinkingAnimation(): void {
		if (this.thinkingInterval) {
			clearInterval(this.thinkingInterval);
			this.thinkingInterval = null;
		}
		this.thinkingMessage.set('');
	}

	private nextMessageId(): number {
		const id = this.messageId;
		this.messageId += 1;
		return id;
	}

	private getErrorMessage(error: unknown): string {
		if (error instanceof HttpErrorResponse) {
			const payload = error.error as
				| { userMessage?: string; message?: string | string[] }
				| undefined;

			if (payload?.userMessage?.trim()) {
				return payload.userMessage.trim();
			}

			if (typeof payload?.message === 'string' && payload.message.trim()) {
				return payload.message.trim();
			}

			if (Array.isArray(payload?.message) && payload.message.length > 0) {
				return payload.message.join(', ');
			}

			if (typeof error.message === 'string' && error.message.trim()) {
				return error.message.trim();
			}
		}

		if (error instanceof Error && error.message.trim()) {
			return error.message.trim();
		}

		return 'Unable to reach the AI assistant right now.';
	}
}
