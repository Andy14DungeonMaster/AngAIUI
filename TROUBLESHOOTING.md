# Troubleshooting Proxy Issues

## Current Issue: 404 Error with Proxy

If you're getting a 404 error like "Cannot POST /v1/chat/completions", follow these steps:

### Step 1: Verify Proxy Configuration

1. Check that `proxy.conf.json` exists in the root directory
2. Verify `angular.json` has the proxy config in the serve options

### Step 2: Restart Dev Server

**IMPORTANT**: The Angular dev server MUST be restarted after adding/changing proxy configuration.

1. Stop the current dev server (Ctrl+C)
2. Start it again:
   ```bash
   npm start
   # or
   ng serve
   ```

### Step 3: Verify Proxy is Working

After restarting, check the terminal output. You should see proxy-related logs when making requests.

### Step 4: Test the Proxy Directly

Open your browser and try:
```
http://localhost:4200/v1/models
```

This should return the list of models from your LLM server if the proxy is working.

### Alternative: Use Direct Connection (If Proxy Doesn't Work)

If the proxy still doesn't work, you can try connecting directly by:

1. Update `src/environments/environment.ts`:
   ```typescript
   lmStudioApiUrl: 'http://localhost:1234/v1/chat/completions',
   ```

2. Ensure your LLM server has CORS enabled (LM Studio should handle this automatically)

3. Check browser console for CORS errors

### Check Dev Server Logs

When you make a request, check the terminal where `ng serve` is running. You should see proxy logs if it's working correctly.

