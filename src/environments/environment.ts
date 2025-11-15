export const environment = {
  production: false,
  // Ollama API endpoint
  ollamaApiUrl: 'http://localhost:11434/api/generate',
  // LM Studio API endpoint (using proxy to bypass CORS)
  // The proxy forwards /v1/* to http://localhost:1234
  lmStudioApiUrl: '/v1/chat/completions',
  // Default provider: 'ollama' or 'lmstudio'
  defaultProvider: 'lmstudio',
  // Default model name
  defaultModel: 'deepseek/deepseek-r1-0528-qwen3-8b'
};

