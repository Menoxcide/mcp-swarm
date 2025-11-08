# MCP-Swarm LM Studio Integration Guide

## 🚀 Quick Start

1. **Install LM Studio** from [lmstudio.ai](https://lmstudio.ai)
2. **Download a model** (search for "Llama 3.2 8B" or "Grok-1")
3. **Start LM Studio server** on port 1234 with GPU acceleration
4. **Configure MCP-Swarm** to use LM Studio
5. **Run tasks** with real AI responses

## 📋 Step-by-Step Setup

### 1. Install LM Studio

Download and install LM Studio from the official website:
- **Download**: https://lmstudio.ai/
- **Platform**: Windows, macOS, Linux supported

### 2. Download and Load a Model

1. Open LM Studio
2. Go to **"Search"** tab
3. Search for a recommended model:
   - **Llama 3.2 8B** (fast, good quality, ~5GB)
   - **Grok-1** (high quality, larger ~80GB)
   - **Mistral Nemo 12B** (balanced performance)
4. Click **"Download"**
5. Wait for download to complete

### 3. Configure GPU Acceleration

1. Go to **"Chat"** or **"Local Server"** tab
2. Click **"Load Model"**
3. Select your downloaded model
4. **Important**: Enable GPU acceleration:
   - Set **"GPU Layers"** to maximum (all layers to CUDA)
   - RTX 30/40 series: ~95% GPU utilization
   - RTX 20/50 series: ~90% GPU utilization

### 4. Start Local Server

1. Click **"Start Server"** button
2. Verify server is running on `http://localhost:1234`
3. Test with: `curl http://localhost:1234/v1/models`

## 🔧 MCP-Swarm Configuration

### Option 1: Automatic Setup (Recommended)

```bash
# Run setup script (detects LM Studio automatically)
./setup-lm-studio.sh    # Linux/Mac
# or
setup-lm-studio.bat     # Windows
```

### Option 2: Manual Configuration

Create a `.env` file in the project root:

```bash
# LM Studio Configuration
USE_LM_STUDIO=true
LM_STUDIO_URL=http://localhost:1234/v1
# LM_STUDIO_API_KEY=optional_api_key

# MCP-Swarm Configuration
NODE_ENV=development
```

### Option 3: Environment Variables

```bash
# Linux/Mac
export USE_LM_STUDIO=true
export LM_STUDIO_URL=http://localhost:1234/v1
node bin/mcp-swarm.cjs "Build a React app"

# Windows
set USE_LM_STUDIO=true
set LM_STUDIO_URL=http://localhost:1234/v1
node bin\mcp-swarm.cjs "Build a React app"
```

## 🧪 Testing the Integration

### Test LM Studio Connection

```bash
# Test if LM Studio is responding
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "test", "messages": [{"role": "user", "content": "Hello"}]}'
```

### Test MCP-Swarm with LM Studio

```bash
# Run with real AI (should show "🚀 Using LM Studio" message)
node bin/mcp-swarm.cjs "Create a simple Node.js API"

# Check that responses are more detailed than mock responses
# Look for "🤖 LM Studio processing" in logs
```

## 📊 Performance Comparison

| Configuration | Response Time | Quality | Privacy |
|---------------|---------------|---------|---------|
| Mock (default) | < 1 second | Basic templates | ✅ Local |
| LM Studio CPU | 5-15 seconds | Good | ✅ Local |
| LM Studio GPU | 2-5 seconds | Excellent | ✅ Local |

## 🔧 Troubleshooting

### LM Studio Not Detected

```bash
# Check if server is running
curl http://localhost:1234/v1/models

# If not responding, restart LM Studio server
# Ensure port 1234 is not blocked by firewall
```

### GPU Not Working

- **RTX 40/50 series**: Requires CUDA 12.8+
- **RTX 30 series**: CUDA 12.4+ recommended
- **RTX 20 series**: CUDA 12.0+ minimum
- Check LM Studio logs for GPU detection errors

### Model Too Slow

- Use smaller models: Llama 3.2 8B instead of 70B
- Enable GPU offloading for all layers
- Reduce context window in LM Studio settings

### Connection Errors

```bash
# Test basic connectivity
ping localhost

# Check LM Studio server status
curl -v http://localhost:1234/v1/models
```

## 🎯 Supported Models

### Recommended for MCP-Swarm

| Model | Size | VRAM | Use Case |
|-------|------|------|----------|
| Llama 3.2 8B | 5GB | 6GB+ | Fast, general purpose |
| Mistral Nemo 12B | 7GB | 8GB+ | Agent tasks, coding |
| Phi-3 Mini 3.8B | 2GB | 4GB+ | Lightweight, fast |
| Grok-1 | 80GB | 24GB+ | High quality, reasoning |

### Advanced Models

| Model | Size | VRAM | Specialty |
|-------|------|------|-----------|
| DeepSeek Coder V2 | 16GB | 12GB+ | Code generation |
| Qwen3-Coder | 35GB | 24GB+ | Multi-language coding |
| Nemotron-Nano-v2 | 15GB | 12GB+ | Tool calling |

## 🚀 Advanced Configuration

### Custom Model Settings

```bash
# Environment variables for fine-tuning
LM_STUDIO_TEMPERATURE=0.7
LM_STUDIO_MAX_TOKENS=2000
LM_STUDIO_MODEL_NAME=custom-model-name
```

### Multiple LM Studio Instances

```bash
# Run different models on different ports
LM_STUDIO_URL=http://localhost:1235/v1  # Second instance
```

### API Key Authentication

```bash
# If LM Studio requires authentication
LM_STUDIO_API_KEY=your_api_key_here
```

## 📈 Monitoring Performance

### GPU Usage Monitoring

- **LM Studio**: Check GPU usage in server tab
- **NVIDIA**: Use `nvidia-smi` command
- **Task Manager**: Monitor GPU utilization

### Response Metrics

- **Tokens/second**: Higher with GPU acceleration
- **Memory usage**: Monitor VRAM consumption
- **Response quality**: Compare to mock responses

## 🎉 Success Indicators

✅ **"🚀 Using LM Studio at http://localhost:1234/v1"** message appears
✅ **"🤖 LM Studio processing"** in agent logs
✅ **Detailed, contextual responses** instead of templates
✅ **GPU utilization** visible in system monitor
✅ **2-4x faster responses** compared to mock mode

## 🔄 Switching Back to Mock Mode

```bash
# Remove environment variables
unset USE_LM_STUDIO
unset LM_STUDIO_URL

# Or set to false
USE_LM_STUDIO=false
```

## 📞 Support

- **LM Studio Docs**: https://lmstudio.ai/docs
- **MCP-Swarm Issues**: GitHub issues
- **Performance Tuning**: Check LM Studio Discord

---

**Ready to experience GPU-accelerated AI agents?** 🚀

```bash
# Start your AI-powered development journey
./setup-lm-studio.sh && node bin/mcp-swarm.cjs "Build something amazing"
```
