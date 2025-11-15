import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  message: string = '';
  @Output() sendMessage = new EventEmitter<string>();
  @Output() isTyping = new EventEmitter<boolean>();

  onSend(): void {
    if (this.message.trim()) {
      this.sendMessage.emit(this.message.trim());
      this.message = '';
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }

  onInput(): void {
    this.isTyping.emit(this.message.length > 0);
  }
}

