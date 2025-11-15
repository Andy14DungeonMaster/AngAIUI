# Project Architecture

## Overview

This is an Angular 17 ChatGPT-like chat application built with **standalone components** and **reactive programming patterns**. The application connects to local LLM APIs (Ollama or LM Studio) to provide AI chat functionality.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Bootstrap                      │
│                    (main.ts)                                 │
│  - Bootstrap standalone app                                  │
│  - Configure providers (Router, HttpClient, Animations)      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    AppComponent (Root)                       │
│  - Entry point component                                     │
│  - Renders ChatContainerComponent                            │
│  - Minimal logic (shell component)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              ChatContainerComponent                          │
│         (Main Layout & State Coordinator)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Responsibilities:                                     │  │
│  │  - Manages sidebar (conversation list)                │  │
│  │  - Coordinates between child components               │  │
│  │  - Handles conversation switching                    │  │
│  │  - Subscribes to ChatService messages$ observable    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────────────────────────┐   │
│  │   Sidebar    │  │  ChatMessagesComponent            │   │
│  │              │  │  (Presentation Component)        │   │
│  │ - New Chat   │  │  - Displays message list          │   │
│  │ - History    │  │  - Auto-scroll                    │   │
│  │ - Delete     │  │  - Loading indicator             │   │
│  └──────────────┘  └──────────────────────────────────┘   │
│                        │                                    │
│                        ▼                                    │
│              ┌─────────────────────┐                      │
│              │ ChatInputComponent  │                      │
│              │ (Input Component)   │                      │
│              │ - Text input        │                      │
│              │ - Send button       │                      │
│              │ - Enter key handler │                      │
│              └─────────────────────┘                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Event: sendMessage
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    ChatService                               │
│         (Business Logic & API Communication)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ State Management:                                     │  │
│  │  - currentConversation: Conversation | null          │  │
│  │  - conversationHistory: Conversation[]               │  │
│  │  - messagesSubject: Subject<Message[]>                │  │
│  │  - messages$: Observable<Message[]>                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Communication:                                     │  │
│  │  - sendToOllama()                                      │  │
│  │  - sendToLMStudio()                                    │  │
│  │  - Uses Angular HttpClient                             │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP POST
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Local LLM API                                  │
│         (Ollama / LM Studio)                                │
│         http://localhost:1234                               │
└─────────────────────────────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Components)

#### AppComponent
- **Role**: Root shell component
- **Responsibility**: Minimal - just renders ChatContainerComponent
- **Standalone**: Yes
- **Dependencies**: RouterOutlet (for future routing)

#### ChatContainerComponent
- **Role**: Main layout and state coordinator
- **Responsibilities**:
  - Manages sidebar visibility
  - Handles conversation list
  - Coordinates between ChatMessagesComponent and ChatInputComponent
  - Subscribes to ChatService.messages$ for reactive updates
  - Manages loading state
- **Lifecycle**: Implements OnInit, OnDestroy (cleanup subscriptions)
- **State**: 
  - `messages: Message[]` - Current conversation messages
  - `conversations: Conversation[]` - All conversations
  - `currentConversation: Conversation | null` - Active conversation
  - `isLoading: boolean` - API request state
  - `sidebarOpen: boolean` - UI state

#### ChatMessagesComponent
- **Role**: Presentation component (dumb component)
- **Responsibilities**:
  - Display message list with bubbles
  - Auto-scroll to latest message
  - Show loading indicator
  - Format timestamps
- **Inputs**: 
  - `@Input() messages: Message[]`
  - `@Input() isLoading: boolean`
- **Lifecycle**: Implements OnInit, OnChanges, AfterViewChecked (for auto-scroll)

#### ChatInputComponent
- **Role**: Input component (dumb component)
- **Responsibilities**:
  - Capture user input
  - Handle Enter key (send) and Shift+Enter (new line)
  - Emit send events to parent
- **Outputs**: 
  - `@Output() sendMessage: EventEmitter<string>`
  - `@Output() isTyping: EventEmitter<boolean>`
- **State**: `message: string` - Current input text

### 2. Service Layer

#### ChatService
- **Role**: Business logic and API communication
- **Pattern**: Singleton service (providedIn: 'root')
- **Responsibilities**:
  - Conversation management (create, switch, delete)
  - Message state management
  - API communication (Ollama/LM Studio)
  - Response processing (cleaning DeepSeek reasoning tags)
  - Error handling
- **State Management**:
  - Uses RxJS Subject for reactive state updates
  - `messagesSubject: Subject<Message[]>` - Internal state emitter
  - `messages$: Observable<Message[]>` - Public observable for components
- **API Integration**:
  - `sendToOllama()` - Handles Ollama API format
  - `sendToLMStudio()` - Handles LM Studio/OpenAI-compatible API format
  - Uses Angular HttpClient for HTTP requests
  - Supports both providers via environment configuration

### 3. Data Layer

#### Models (TypeScript Interfaces)
Located in `src/app/models/message.ts`:

- **Message**: Individual chat message
  ```typescript
  {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }
  ```

- **Conversation**: Chat conversation container
  ```typescript
  {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- **API Request/Response Types**:
  - `ChatRequest` - Request format for Ollama
  - `OllamaResponse` - Response format from Ollama
  - `LMStudioResponse` - Response format from LM Studio (OpenAI-compatible)

### 4. Configuration Layer

#### Environment Configuration
- `src/environments/environment.ts` - Development config
- `src/environments/environment.prod.ts` - Production config
- Configurable:
  - API endpoints (Ollama, LM Studio)
  - Default provider
  - Default model name

#### Proxy Configuration
- `proxy.conf.json` - Angular dev server proxy
- Forwards `/v1/*` requests to `http://localhost:1234`
- Bypasses CORS issues in development

## Design Patterns

### 1. Standalone Components Pattern
- **All components are standalone** (Angular 17 feature)
- No NgModules required
- Components import only what they need
- Better tree-shaking and performance

### 2. Reactive Programming (RxJS)
- **Observable Pattern**: ChatService uses Subject/Observable
- **Unidirectional Data Flow**: Service → Observable → Components
- **Subscription Management**: Components unsubscribe in ngOnDestroy

### 3. Dependency Injection
- **Service Injection**: ChatService injected into ChatContainerComponent
- **HttpClient Injection**: Injected into ChatService
- **Root-level Services**: Services provided at root level (singleton)

### 4. Component Communication
- **Parent → Child**: `@Input()` properties
- **Child → Parent**: `@Output()` EventEmitters
- **Service → Components**: RxJS Observables
- **No direct component-to-component communication**

### 5. Single Responsibility Principle
- Each component has one clear responsibility
- ChatService handles all business logic
- Components focus on presentation and user interaction

## Data Flow

### Sending a Message Flow

```
1. User types message
   └─> ChatInputComponent.message (local state)

2. User clicks Send or presses Enter
   └─> ChatInputComponent.onSend()
       └─> Emits sendMessage event

3. ChatContainerComponent receives event
   └─> ChatContainerComponent.onSendMessage(message)
       └─> Sets isLoading = true
       └─> Calls ChatService.sendMessage(message)

4. ChatService processes message
   ├─> Creates user Message object
   ├─> Adds to currentConversation.messages
   ├─> Emits update via messagesSubject.next()
   │   └─> ChatContainerComponent receives via subscription
   │       └─> Updates local messages array
   │           └─> ChatMessagesComponent displays message
   │
   └─> Calls API (sendToLMStudio or sendToOllama)
       ├─> Builds request body
       ├─> Sends HTTP POST via HttpClient
       ├─> Receives response
       ├─> Cleans response (removes reasoning tags)
       ├─> Creates assistant Message object
       ├─> Adds to currentConversation.messages
       └─> Emits update via messagesSubject.next()
           └─> UI updates reactively

5. ChatContainerComponent
   └─> Sets isLoading = false
```

### State Management Flow

```
ChatService (Single Source of Truth)
  ├─> currentConversation: Conversation | null
  ├─> conversationHistory: Conversation[]
  └─> messagesSubject: Subject<Message[]>
      └─> messages$: Observable<Message[]>
          └─> ChatContainerComponent subscribes
              └─> Updates local messages: Message[]
                  └─> Passes to ChatMessagesComponent via @Input()
```

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── chat-container/          # Main layout component
│   │   │   ├── chat-container.component.ts
│   │   │   ├── chat-container.component.html
│   │   │   └── chat-container.component.css
│   │   ├── chat-messages/            # Message display component
│   │   │   ├── chat-messages.component.ts
│   │   │   ├── chat-messages.component.html
│   │   │   └── chat-messages.component.css
│   │   └── chat-input/               # Input component
│   │       ├── chat-input.component.ts
│   │       ├── chat-input.component.html
│   │       └── chat-input.component.css
│   ├── services/
│   │   └── chat.service.ts           # Business logic & API
│   ├── models/
│   │   └── message.ts               # TypeScript interfaces
│   ├── app.component.ts             # Root component
│   ├── app.component.html
│   ├── app.component.css
│   └── app.routes.ts                # Routing configuration
├── environments/
│   ├── environment.ts               # Dev configuration
│   └── environment.prod.ts         # Prod configuration
├── main.ts                          # Application bootstrap
├── index.html                       # HTML entry point
└── styles.css                       # Global styles (TailwindCSS)
```

## Key Technologies

### Core
- **Angular 17**: Latest Angular with standalone components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming (Observables, Subjects)

### Styling
- **TailwindCSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

### HTTP
- **Angular HttpClient**: For API communication
- **Proxy Configuration**: For CORS bypass in development

### Build Tools
- **Angular CLI**: Build and development server
- **TypeScript Compiler**: Type checking and compilation

## State Management Strategy

### Current Approach: Service-Based with RxJS
- **Single Source of Truth**: ChatService holds all state
- **Reactive Updates**: Components subscribe to observables
- **No External State Management**: No NgRx, Redux, etc.
- **Simple and Effective**: For this application's needs

### Why This Approach?
- **Simplicity**: No need for complex state management
- **Angular-Native**: Uses built-in Angular patterns
- **Reactive**: RxJS provides powerful reactive capabilities
- **Maintainable**: Easy to understand and modify

## API Integration

### Supported Providers

#### Ollama
- **Endpoint**: `http://localhost:11434/api/generate`
- **Format**: Simple prompt-based
- **Request**: `{ model, prompt, stream }`
- **Response**: `{ response, done }`

#### LM Studio (OpenAI-Compatible)
- **Endpoint**: `http://localhost:1234/v1/chat/completions`
- **Format**: OpenAI Chat Completions API
- **Request**: `{ model, messages[], temperature, max_tokens }`
- **Response**: `{ choices: [{ message: { role, content } }] }`

### Error Handling
- Network errors: User-friendly messages
- API errors: Detailed error information
- Fallback: Error messages displayed in chat

## Security Considerations

### Development
- **Proxy Configuration**: Bypasses CORS for local development
- **Local API**: All requests to localhost (no external APIs)

### Production Considerations
- Environment-based configuration
- API endpoint validation
- Error message sanitization
- Input validation

## Performance Optimizations

### Current
- **OnPush Change Detection**: Could be added for better performance
- **Lazy Loading**: Routes use lazy component loading
- **Tree Shaking**: Standalone components enable better tree-shaking

### Potential Improvements
- Virtual scrolling for long message lists
- Message pagination
- Caching conversation history
- Optimistic UI updates

## Testing Strategy

### Unit Testing
- Components: Test in isolation
- Services: Mock HTTP calls
- Models: Type validation

### Integration Testing
- Component interactions
- Service integration
- API mocking

### E2E Testing
- User workflows
- API integration
- Error scenarios

## Scalability Considerations

### Current Limitations
- In-memory state (lost on refresh)
- No persistence layer
- Single conversation at a time

### Future Enhancements
- LocalStorage persistence
- IndexedDB for large conversations
- Backend API integration
- Multi-user support
- Message search
- Export conversations

## Summary

This application follows **Angular best practices** with:
- ✅ Standalone components architecture
- ✅ Reactive programming with RxJS
- ✅ Service-based state management
- ✅ Clear separation of concerns
- ✅ Type-safe TypeScript interfaces
- ✅ Modular and maintainable code structure

The architecture is designed to be:
- **Simple**: Easy to understand and modify
- **Scalable**: Can be extended with additional features
- **Maintainable**: Clear structure and patterns
- **Testable**: Components and services are easily testable

