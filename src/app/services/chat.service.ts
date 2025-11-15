import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message, Conversation, ChatRequest, OllamaResponse, LMStudioResponse } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private currentConversation: Conversation | null = null;
  private conversationHistory: Conversation[] = [];
  private messagesSubject = new Subject<Message[]>();
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with a default conversation
    this.createNewConversation();
  }

  createNewConversation(): Conversation {
    const newConversation: Conversation = {
      id: this.generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.currentConversation = newConversation;
    this.conversationHistory.unshift(newConversation);
    this.messagesSubject.next([]);
    return newConversation;
  }

  getCurrentConversation(): Conversation | null {
    return this.currentConversation;
  }

  getConversationHistory(): Conversation[] {
    return this.conversationHistory;
  }

  setCurrentConversation(conversation: Conversation): void {
    this.currentConversation = conversation;
    this.messagesSubject.next([...conversation.messages]);
  }

  async sendMessage(content: string, provider: 'ollama' | 'lmstudio' = environment.defaultProvider as 'ollama' | 'lmstudio'): Promise<void> {
    if (!this.currentConversation) {
      this.createNewConversation();
    }

    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      role: 'user',
      content: content,
      timestamp: new Date()
    };

    this.currentConversation!.messages.push(userMessage);
    this.currentConversation!.updatedAt = new Date();
    this.messagesSubject.next([...this.currentConversation!.messages]);

    try {
      let assistantResponse = '';

      if (provider === 'ollama') {
        assistantResponse = await this.sendToOllama(content);
      } else {
        assistantResponse = await this.sendToLMStudio(content);
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: this.generateId(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      this.currentConversation!.messages.push(assistantMessage);
      this.currentConversation!.updatedAt = new Date();
      
      // Update conversation title if it's the first exchange
      if (this.currentConversation!.messages.length === 2) {
        this.currentConversation!.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
      }

      this.messagesSubject.next([...this.currentConversation!.messages]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create a more detailed error message
      let errorContent = 'Sorry, I encountered an error. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorContent += 'Unable to connect to the API. Please ensure your LLM server is running at ' + 
                         (provider === 'ollama' ? environment.ollamaApiUrl : environment.lmStudioApiUrl);
        } else if (error.message.includes('404')) {
          errorContent += 'API endpoint not found. Please check your API URL configuration.';
        } else if (error.message.includes('500')) {
          errorContent += 'Server error. The LLM server may be experiencing issues.';
        } else {
          errorContent += `Error: ${error.message}`;
        }
      } else {
        errorContent += 'Please check your API connection and try again.';
      }
      
      const errorMessage: Message = {
        id: this.generateId(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      this.currentConversation!.messages.push(errorMessage);
      this.messagesSubject.next([...this.currentConversation!.messages]);
    }
  }

  private async sendToOllama(prompt: string): Promise<string> {
    const requestBody: ChatRequest = {
      model: environment.defaultModel,
      prompt: prompt,
      stream: false
    };

    try {
      const response = await fetch(environment.ollamaApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  }

  private async sendToLMStudio(message: string): Promise<string> {
    // Build conversation context from current messages
    // Include all messages in the conversation (user message was already added)
    const conversationMessages = this.currentConversation!.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Ensure messages array is not empty
    if (conversationMessages.length === 0) {
      throw new Error('Messages array cannot be empty');
    }

    const requestBody = {
      model: environment.defaultModel,
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 1000
    };

    console.log('Sending request to LM Studio:', {
      url: environment.lmStudioApiUrl,
      model: environment.defaultModel,
      messageCount: conversationMessages.length,
      messages: conversationMessages
    });

    try {
      const requestBodyString = JSON.stringify(requestBody);
      console.log('Request body:', requestBodyString);
      
      // Check if URL is reachable first
      if (!environment.lmStudioApiUrl) {
        throw new Error('LM Studio API URL is not configured');
      }
      
      // Use Angular HttpClient which handles CORS better
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const data: LMStudioResponse = await firstValueFrom(
        this.http.post<LMStudioResponse>(environment.lmStudioApiUrl, requestBody, { headers })
      ).catch((error: any) => {
        console.error('LM Studio API error:', error);
        if (error.status === 0) {
          throw new Error(`Network error: Unable to reach ${environment.lmStudioApiUrl}. Is your LLM server running?`);
        } else if (error.status === 404) {
          throw new Error(`API endpoint not found. Check your server configuration.`);
        } else if (error.error) {
          throw new Error(`LM Studio API error: ${error.status} ${error.statusText} - ${JSON.stringify(error.error)}`);
        }
        throw error;
      }) as LMStudioResponse;
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from LM Studio API');
      }
      let content = data.choices[0]?.message?.content || '';
      
      // Clean DeepSeek R1 reasoning tags for cleaner display
      content = this.cleanDeepSeekResponse(content);
      
      return content;
    } catch (error) {
      console.error('LM Studio API error:', error);
      throw error;
    }
  }

  private cleanDeepSeekResponse(content: string): string {
    // Remove DeepSeek R1 reasoning tags (<think>, <think>, etc.)
    // These tags contain internal reasoning that users typically don't want to see
    let cleaned = content;
    
    // Remove <think>...</think> blocks
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/redacted_reasoning>/gi, '');
    
    // Remove any remaining reasoning tags
    cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');
    
    // Clean up extra whitespace and newlines
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

