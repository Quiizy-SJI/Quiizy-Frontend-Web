import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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
	isSending = false;
	isLoggingOut = false;
	errorMessage = '';

	private messageId = 1;

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
		return !this.isSending && this.prompt.trim().length > 0;
	}

	async sendMessage(): Promise<void> {
		const question = this.prompt.trim();
		if (!question || this.isSending) {
			return;
		}

		this.errorMessage = '';
		this.pushMessage('student', question);
		this.prompt = '';
		this.isSending = true;

		try {
			const reply = await firstValueFrom(this.chatService.askQuestion(question));
			this.pushAssistantReply(reply);
		} catch (error: unknown) {
			this.errorMessage =
				error instanceof Error
					? error.message
					: 'Unable to reach the AI assistant right now.';
		} finally {
			this.isSending = false;
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
}
