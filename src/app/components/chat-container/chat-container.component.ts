import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatService } from '../../services/chat.service';
import { Message, Conversation } from '../../models/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, ChatMessagesComponent, ChatInputComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  isLoading: boolean = false;
  sidebarOpen: boolean = true;
  private messagesSubscription?: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.conversations = this.chatService.getConversationHistory();
    this.currentConversation = this.chatService.getCurrentConversation();
    
    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  onSendMessage(message: string): void {
    if (!message.trim()) return;

    this.isLoading = true;
    this.chatService.sendMessage(message).then(() => {
      this.isLoading = false;
      this.conversations = this.chatService.getConversationHistory();
      this.currentConversation = this.chatService.getCurrentConversation();
    }).catch(() => {
      this.isLoading = false;
    });
  }

  createNewConversation(): void {
    this.chatService.createNewConversation();
    this.conversations = this.chatService.getConversationHistory();
    this.currentConversation = this.chatService.getCurrentConversation();
  }

  selectConversation(conversation: Conversation): void {
    this.chatService.setCurrentConversation(conversation);
    this.currentConversation = conversation;
    this.conversations = this.chatService.getConversationHistory();
  }

  deleteConversation(conversationId: string, event: Event): void {
    event.stopPropagation();
    this.conversations = this.conversations.filter(c => c.id !== conversationId);
    if (this.currentConversation?.id === conversationId) {
      if (this.conversations.length > 0) {
        this.selectConversation(this.conversations[0]);
      } else {
        this.createNewConversation();
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

