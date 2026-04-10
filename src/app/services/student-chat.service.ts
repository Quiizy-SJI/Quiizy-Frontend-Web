import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toStringRequired } from '../core/utils/payload-sanitizer';
import { ApiClientService } from '../core/http/api-client.service';

export interface StudentChatReply {
  answer: string;
  detectedLanguage: string;
  model: string;
  generatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentChatService {
  private readonly endpoint = '/students/me/chat';

  constructor(private readonly api: ApiClientService) {}

  askQuestion(question: string): Observable<StudentChatReply> {
    return this.api.post<StudentChatReply>(this.endpoint, {
      question: toStringRequired(question),
    });
  }
}