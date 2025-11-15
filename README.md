# 🤖 AI Angular Chat

A modern, ChatGPT-like chat interface built with **Angular 17** and **standalone components**, designed to connect to local Large Language Model (LLM) APIs like Ollama and LM Studio. Chat with AI models running on your local machine with a beautiful, responsive UI.

![Angular](https://img.shields.io/badge/Angular-17-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8)

## ✨ Features

- 🎨 **ChatGPT-Inspired UI**: Clean, modern interface with message bubbles and smooth animations
- 💬 **Real-time Chat**: Interactive chat interface with instant message display
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Auto-scroll**: Automatically scrolls to the latest message
- ⚡ **Loading Indicators**: Animated typing dots while waiting for AI responses
- 🔌 **Multi-Provider Support**: Works with both Ollama and LM Studio APIs
- 📚 **Conversation Management**: Create, switch, and delete multiple conversations
- 🎯 **Standalone Components**: Built with Angular 17's modern standalone architecture
- 🎨 **TailwindCSS Styling**: Beautiful, utility-first CSS framework
- 🔍 **Type-Safe**: Full TypeScript support with interfaces and types

## 🎯 What is This Project?

This project provides a **local AI chat interface** that connects to LLM servers running on your machine. Instead of using cloud-based AI services, you can:

- Run AI models locally (privacy-focused)
- Use models like Llama 2, Mistral, DeepSeek, and more
- Have full control over your data
- No API costs or rate limits
- Work offline (once models are downloaded)

Perfect for developers, researchers, or anyone who wants to experiment with local LLMs through a polished web interface.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Angular CLI 17+** (will be installed with dependencies)
- **A local LLM server** running (Ollama or LM Studio)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-angular-chat.git
cd ai-angular-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your LLM Provider

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  ollamaApiUrl: 'http://localhost:11434/api/generate',
  lmStudioApiUrl: '/v1/chat/completions', // Uses proxy
  defaultProvider: 'lmstudio', // or 'ollama'
  defaultModel: 'deepseek/deepseek-r1-0528-qwen3-8b' // Your model name
};
```

### 4. Start Your LLM Server

**Option A: Using LM Studio**
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Load a model in LM Studio
3. Start the local server (usually port 1234)

**Option B: Using Ollama**
1. Download and install [Ollama](https://ollama.ai/)
2. Pull a model: `ollama pull llama2`
3. Ollama runs automatically on port 11434

### 5. Start the Angular Application

```bash
npm start
```

The application will open at `http://localhost:4200`

## 📖 Detailed Setup Guide

### Setting Up Ollama

1. **Install Ollama**
   ```bash
   # macOS/Linux
   curl https://ollama.ai/install.sh | sh
   
   # Or download from https://ollama.ai
   ```

2. **Pull a Model**
   ```bash
   ollama pull llama2
   # or
   ollama pull mistral
   # or
   ollama pull codellama
   ```

3. **Verify Installation**
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. **Update Environment**
   ```typescript
   defaultProvider: 'ollama',
   defaultModel: 'llama2' // Match your pulled model
   ```

### Setting Up LM Studio

1. **Download LM Studio**
   - Visit [https://lmstudio.ai](https://lmstudio.ai)
   - Download and install for your platform

2. **Load a Model**
   - Open LM Studio
   - Go to "Search" tab
   - Download a model (e.g., DeepSeek, Llama, Mistral)
   - Load the model

3. **Start Local Server**
   - Go to "Local Server" tab
   - Click "Start Server"
   - Server runs on `http://localhost:1234`

4. **Verify Server**
   ```bash
   curl http://localhost:1234/v1/models
   ```

5. **Update Environment**
   ```typescript
   defaultProvider: 'lmstudio',
   defaultModel: 'your-model-name' // Check LM Studio for exact name
   ```

## 🏗️ Project Structure

```
ai-angular-chat/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat-container/      # Main layout with sidebar
│   │   │   ├── chat-messages/        # Message display component
│   │   │   └── chat-input/           # Input component
│   │   ├── services/
│   │   │   └── chat.service.ts       # API communication & state
│   │   ├── models/
│   │   │   └── message.ts            # TypeScript interfaces
│   │   ├── app.component.ts          # Root component
│   │   └── app.routes.ts             # Routing config
│   ├── environments/
│   │   ├── environment.ts            # Dev configuration
│   │   └── environment.prod.ts       # Prod configuration
│   ├── main.ts                       # Application bootstrap
│   └── styles.css                    # Global styles (TailwindCSS)
├── proxy.conf.json                   # Dev server proxy (CORS bypass)
├── angular.json                      # Angular configuration
├── tailwind.config.js                # TailwindCSS configuration
└── package.json                      # Dependencies
```

## 🎮 Usage

### Starting a Conversation

1. Type your message in the input box at the bottom
2. Press **Enter** to send (or **Shift+Enter** for a new line)
3. Click the **Send** button
4. Wait for the AI response (you'll see typing dots)

### Managing Conversations

- **New Chat**: Click "New Chat" in the sidebar
- **Switch Conversation**: Click any conversation in the sidebar
- **Delete Conversation**: Hover over a conversation and click the delete icon
- **Toggle Sidebar**: Click the hamburger menu in the header

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message

## 🔧 Configuration

### Environment Variables

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  // Ollama API endpoint
  ollamaApiUrl: 'http://localhost:11434/api/generate',
  // LM Studio API endpoint (uses proxy in dev)
  lmStudioApiUrl: '/v1/chat/completions',
  // Default provider
  defaultProvider: 'lmstudio', // 'ollama' | 'lmstudio'
  // Default model name (must match your loaded model)
  defaultModel: 'deepseek/deepseek-r1-0528-qwen3-8b'
};
```

### Proxy Configuration

The project includes a proxy configuration (`proxy.conf.json`) to bypass CORS issues in development. The proxy forwards `/v1/*` requests to your LLM server.

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build --configuration production

# Run tests
npm test
# or
ng test

# Watch mode (rebuild on changes)
npm run watch
```

### Building for Production

```bash
ng build --configuration production
```

Output will be in the `dist/ai-angular-chat/` directory.

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: "Network error: Unable to reach API"

**Solutions**:
1. Verify your LLM server is running:
   ```bash
   # For Ollama
   curl http://localhost:11434/api/tags
   
   # For LM Studio
   curl http://localhost:1234/v1/models
   ```

2. Check the model name matches:
   - Ollama: Run `ollama list` to see available models
   - LM Studio: Check the model name in the server tab

3. Verify CORS (if using direct connection):
   - LM Studio should handle CORS automatically
   - If issues persist, the proxy should handle it

**Problem**: "404 Cannot POST /v1/chat/completions"

**Solutions**:
1. Restart the Angular dev server after changing proxy config
2. Verify `proxy.conf.json` exists in the root directory
3. Check `angular.json` has proxy configuration

### Build Issues

**Problem**: TypeScript errors or build failures

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Angular CLI version
ng version
# Should be 17 or higher
```

### Model Not Found

**Problem**: API returns model not found error

**Solutions**:
1. Verify model name in `environment.ts` matches exactly
2. For Ollama: Check with `ollama list`
3. For LM Studio: Check the exact model ID in the server tab

## 🏛️ Architecture

This project follows Angular best practices:

- **Standalone Components**: All components are standalone (Angular 17)
- **Reactive Programming**: Uses RxJS Observables for state management
- **Service-Based State**: ChatService manages all application state
- **Type Safety**: Full TypeScript with interfaces
- **Component Communication**: Parent-child via @Input/@Output, service via Observables

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## 📚 API Integration

### Supported Providers

#### Ollama
- **Endpoint**: `http://localhost:11434/api/generate`
- **Format**: Simple prompt-based API
- **Request**: `{ model, prompt, stream }`
- **Response**: `{ response, done }`

#### LM Studio (OpenAI-Compatible)
- **Endpoint**: `http://localhost:1234/v1/chat/completions`
- **Format**: OpenAI Chat Completions API
- **Request**: `{ model, messages[], temperature, max_tokens }`
- **Response**: `{ choices: [{ message: { role, content } }] }`

## 🎨 Styling

The project uses **TailwindCSS** for styling:

- Utility-first CSS framework
- Responsive design
- Custom scrollbars
- Smooth transitions
- ChatGPT-inspired color scheme

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Angular](https://angular.io/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Compatible with [Ollama](https://ollama.ai/) and [LM Studio](https://lmstudio.ai/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/yourusername/ai-angular-chat/issues)
3. Create a new issue with details about your problem

## 🚀 Future Enhancements

- [ ] Message persistence (LocalStorage/IndexedDB)
- [ ] Export conversations
- [ ] Message search
- [ ] Streaming responses
- [ ] Multiple model support per conversation
- [ ] Dark/light theme toggle
- [ ] Markdown rendering in messages
- [ ] Code syntax highlighting

---

Made with ❤️ using Angular 17
