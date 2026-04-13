import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom, interval } from 'rxjs';
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

	readonly session = computed(() => this.authStore.getSession());

	prompt = '';
	isSending = signal(false);
	isLoggingOut = false;
	errorMessage = '';
	thinkingMessage = signal('');

	private messageId = 1;
	private readonly thinkingPhrases = [
		'Assistant is thinking...',
		'Analyzing your context...',
		'Generating response...',
		'Processing your question...',
		'Almost there...',
	];
	private thinkingInterval: any = null;
	private destroy$ = interval(0);

	messages: ChatMessage[] = [
		{
			id: this.nextMessageId(),
			role: 'assistant',
			text: 'Hello! I am your Quizzy AI assistant. Ask me about your class, semester, courses, teachers, or exams.',
			createdAt: new Date(),
		},
	];

	get studentName(): string {
		const user = this.session()?.user;
		if (!user) return 'Student';

		const fullName = `${user.name ?? ''} ${user.surname ?? ''}`.trim();
		return fullName || user.email || 'Student';
	}

	get canSend(): boolean {
		return !this.isSending() && this.prompt.trim().length > 0;
	}

	async sendMessage(): Promise<void> {
		const question = this.prompt.trim();
		if (!question || this.isSending()) {
			return;
		}

		this.errorMessage = '';
		this.pushMessage('student', question);
		this.prompt = '';
		this.isSending.set(true);
		this.startThinkingAnimation();

		try {
			const reply = await firstValueFrom(this.chatService.askQuestion(question));
			this.pushAssistantReply(reply);
		} catch (error: unknown) {
			this.errorMessage = this.getErrorMessage(error);
		} finally {
			this.isSending.set(false);
			this.stopThinkingAnimation();
		}
	}

	async logout(): Promise<void> {
		if (this.isLoggingOut) {
			return;
		}

		this.isLoggingOut = true;
		this.errorMessage = '';

		try {
			await firstValueFrom(this.authService.logout());
		} catch {
			// Local logout still happens through auth service finalize logic.
		} finally {
			this.isLoggingOut = false;
			await this.router.navigateByUrl('/login');
		}
	}

	private pushAssistantReply(reply: StudentChatReply): void {
		this.messages = [
			...this.messages,
			{
				id: this.nextMessageId(),
				role: 'assistant',
				text: reply.answer,
				createdAt: new Date(reply.generatedAt),
				language: reply.detectedLanguage,
			},
		];
	}

	private pushMessage(role: ChatRole, text: string): void {
		this.messages = [
			...this.messages,
			{
				id: this.nextMessageId(),
				role,
				text,
				createdAt: new Date(),
			},
		];
	}

	private nextMessageId(): number {
		const id = this.messageId;
		this.messageId += 1;
		return id;
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
