# Application Workflow Documentation

## Overview
This is an Angular 17 ChatGPT-like chat application that connects to local LLM APIs (Ollama or LM Studio). The application uses standalone components and follows a reactive architecture with RxJS observables.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Bootstrap                     │
│                    (main.ts)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    AppComponent                              │
│              (Root Component)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              ChatContainerComponent                           │
│         (Main Layout - Sidebar + Chat Area)                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐  │
│  │   Sidebar    │  │  ChatMessagesComponent               │  │
│  │ (Conversations)│  │  (Displays Messages)               │  │
│  └──────────────┘  └──────────────────────────────────────┘  │
│                        │                                      │
│                        ▼                                      │
│              ┌─────────────────────┐                         │
│              │ ChatInputComponent  │                         │
│              │ (Text Input + Send) │                         │
│              └─────────────────────┘                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    ChatService                               │
│         (Business Logic + API Communication)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Local LLM API (Ollama/LM Studio)                │
│              http://127.0.0.1:1234                          │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Workflow

### 1. Application Initialization

**File: `main.ts`**
```
1. Bootstrap Angular application
2. Configure providers (Router, Animations)
3. Load AppComponent
```

**File: `app.component.ts`**
```
1. AppComponent loads
2. Renders ChatContainerComponent
```

**File: `chat.service.ts` (Constructor)**
```
1. ChatService is instantiated (singleton, providedIn: 'root')
2. Automatically creates a new conversation
3. Initializes empty conversation history
4. Sets up RxJS Subject for message updates
```

### 2. Component Initialization

**ChatContainerComponent.ngOnInit()**
```
1. Gets conversation history from ChatService
2. Gets current conversation from ChatService
3. Subscribes to messages$ observable
   - This keeps the UI in sync with service state
4. Initializes sidebar state (open by default)
```

**ChatMessagesComponent.ngOnInit()**
```
1. Sets up auto-scroll flag
2. Prepares to display messages
```

### 3. User Interaction Flow: Sending a Message

#### Step 1: User Types Message
```
User → ChatInputComponent
  ├─ Types in textarea
  ├─ onInput() emits typing state
  └─ Can press Enter (without Shift) to send
```

#### Step 2: User Clicks Send or Presses Enter
```
ChatInputComponent.onSend()
  ├─ Validates message is not empty
  ├─ Emits sendMessage event with message text
  └─ Clears input field
```

#### Step 3: Container Receives Event
```
ChatContainerComponent.onSendMessage(message)
  ├─ Validates message
  ├─ Sets isLoading = true (shows loading indicator)
  └─ Calls ChatService.sendMessage(message)
```

#### Step 4: Service Processes Message
```
ChatService.sendMessage(content)
  ├─ Ensures current conversation exists
  ├─ Creates user Message object:
  │   - id: generated unique ID
  │   - role: 'user'
  │   - content: message text
  │   - timestamp: current date
  ├─ Adds message to current conversation
  ├─ Updates conversation timestamp
  └─ Emits updated messages via messagesSubject
     └─ ChatContainerComponent receives update via subscription
        └─ UI immediately shows user message
```

#### Step 5: API Call
```
ChatService.sendToLMStudio(message)
  ├─ Builds conversation context:
  │   └─ Maps all messages in conversation to API format
  ├─ Creates request body:
  │   {
  │     model: "deepseek/deepseek-r1-0528-qwen3-8b",
  │     messages: [{role: "user", content: "..."}, ...],
  │     temperature: 0.7,
  │     max_tokens: 1000
  │   }
  ├─ Sends POST request to http://127.0.0.1:1234/v1/chat/completions
  ├─ Handles response
  └─ Cleans response (removes reasoning tags for DeepSeek R1)
```

#### Step 6: Response Handling
```
ChatService.sendMessage() (continued)
  ├─ Creates assistant Message object:
  │   - id: generated unique ID
  │   - role: 'assistant'
  │   - content: cleaned API response
  │   - timestamp: current date
  ├─ Adds message to current conversation
  ├─ Updates conversation title (if first exchange)
  ├─ Updates conversation timestamp
  └─ Emits updated messages via messagesSubject
     └─ ChatContainerComponent receives update
        ├─ Sets isLoading = false
        └─ Updates conversation list
```

#### Step 7: UI Update
```
ChatMessagesComponent
  ├─ Receives new messages array via @Input()
  ├─ ngOnChanges() detects change
  ├─ Sets shouldScroll flag
  ├─ ngAfterViewChecked() triggers
  └─ scrollToBottom() scrolls to latest message
```

### 4. Conversation Management Flow

#### Creating New Conversation
```
User clicks "New Chat" button
  └─ ChatContainerComponent.createNewConversation()
     └─ ChatService.createNewConversation()
        ├─ Creates new Conversation object
        ├─ Sets as current conversation
        ├─ Adds to conversation history (at beginning)
        └─ Emits empty messages array
           └─ UI clears message display
```

#### Switching Conversations
```
User clicks conversation in sidebar
  └─ ChatContainerComponent.selectConversation(conversation)
     └─ ChatService.setCurrentConversation(conversation)
        ├─ Sets conversation as current
        └─ Emits conversation's messages
           └─ UI displays conversation messages
```

#### Deleting Conversation
```
User hovers over conversation → clicks delete icon
  └─ ChatContainerComponent.deleteConversation(id)
     ├─ Removes from local conversations array
     ├─ If current conversation deleted:
     │   └─ Switches to first available or creates new
     └─ Updates UI
```

### 5. Data Flow Architecture

#### Reactive Pattern (RxJS)
```
ChatService
  ├─ messagesSubject: Subject<Message[]>
  └─ messages$: Observable<Message[]>
     └─ ChatContainerComponent subscribes
        └─ Updates local messages array
           └─ Passes to ChatMessagesComponent via @Input()
```

#### State Management
```
ChatService (Single Source of Truth)
  ├─ currentConversation: Conversation | null
  ├─ conversationHistory: Conversation[]
  └─ All state changes emit via Subject
     └─ Components react to changes
```

### 6. Error Handling Flow

```
API Call Fails
  └─ ChatService.sendMessage() catch block
     ├─ Logs error to console
     ├─ Creates error message:
     │   "Sorry, I encountered an error..."
     ├─ Adds to conversation
     └─ Emits via messagesSubject
        └─ UI displays error message
           └─ ChatContainerComponent sets isLoading = false
```

### 7. Auto-Scroll Mechanism

```
New Message Added
  └─ ChatMessagesComponent.ngOnChanges()
     ├─ Detects messages array change
     ├─ Sets shouldScroll = true
     └─ ngAfterViewChecked()
        ├─ Checks shouldScroll flag
        ├─ Calls scrollToBottom()
        │   └─ Scrolls messagesContainer to bottom
        └─ Resets shouldScroll flag
```

### 8. Message Display Logic

```
ChatMessagesComponent Template
  ├─ Loops through messages array
  ├─ For each message:
  │   ├─ Checks role ('user' or 'assistant')
  │   ├─ Applies appropriate styling:
  │   │   - User: green bubble, right-aligned
  │   │   - Assistant: grey bubble, left-aligned
  │   └─ Displays timestamp
  ├─ Shows loading indicator if isLoading = true
  └─ Shows empty state if no messages
```

## Key Design Patterns

### 1. **Observer Pattern (RxJS)**
- Service uses Subject to notify components of state changes
- Components subscribe to observables for reactive updates

### 2. **Component Communication**
- Parent → Child: @Input() properties
- Child → Parent: @Output() EventEmitters
- Service → Components: RxJS Observables

### 3. **Single Responsibility**
- ChatService: Business logic + API communication
- ChatContainerComponent: Layout + coordination
- ChatMessagesComponent: Message display
- ChatInputComponent: User input handling

### 4. **Dependency Injection**
- ChatService injected into ChatContainerComponent
- Provided at root level (singleton)

## API Integration Details

### LM Studio API Format
```typescript
POST http://127.0.0.1:1234/v1/chat/completions
Headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
Body: {
  model: string,
  messages: Array<{role: 'user' | 'assistant', content: string}>,
  temperature: number,
  max_tokens: number
}
```

### Response Processing
```
1. Receive JSON response
2. Extract content from choices[0].message.content
3. Clean DeepSeek R1 reasoning tags
4. Return cleaned content
```

## State Lifecycle

```
Application Start
  └─ ChatService creates default conversation
     └─ Components initialize and subscribe
        └─ UI displays empty conversation

User Sends Message
  └─ Message added to conversation
     └─ API called
        └─ Response added to conversation
           └─ UI updates reactively

User Creates New Conversation
  └─ New conversation created
     └─ Previous conversation saved in history
        └─ UI switches to new conversation

User Switches Conversation
  └─ Service updates current conversation
     └─ Messages emitted via Subject
        └─ UI displays selected conversation
```

## Performance Considerations

1. **Auto-scroll**: Uses ViewChild and AfterViewChecked for efficient scrolling
2. **Change Detection**: OnPush strategy could be added for better performance
3. **Memory Management**: Subscriptions properly unsubscribed in ngOnDestroy
4. **API Calls**: Async/await pattern for non-blocking operations

## Summary

The application follows a clean, reactive architecture where:
- **Service** manages state and API communication
- **Components** handle UI and user interactions
- **RxJS** provides reactive data flow
- **Standalone components** enable modular architecture
- **TypeScript interfaces** ensure type safety

The workflow is unidirectional: User Input → Component → Service → API → Service → Component → UI Update

