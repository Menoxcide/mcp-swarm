@echo off
REM MCP-Swarm LM Studio Setup Script for Windows
echo 🚀 Setting up MCP-Swarm with LM Studio integration
echo.

REM Check if LM Studio is running
echo 📡 Checking if LM Studio is running on localhost:1234...
curl -s http://localhost:1234/v1/models >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ LM Studio server detected!
) else (
    echo ❌ LM Studio server not found on localhost:1234
    echo.
    echo Please start LM Studio and:
    echo 1. Load a model ^(e.g., Llama 3.2 8B, Grok-1^)
    echo 2. Start the local server on port 1234
    echo 3. Enable GPU acceleration if available
    echo.
    echo Then run this script again.
    exit /b 1
)

REM Create .env file for configuration
echo 📝 Creating .env configuration file...
(
echo # LM Studio Configuration
echo USE_LM_STUDIO=true
echo LM_STUDIO_URL=http://localhost:1234/v1
echo # LM_STUDIO_API_KEY=your_api_key_here  # Optional, usually not needed for local LM Studio
echo.
echo # MCP-Swarm Configuration
echo NODE_ENV=development
) > .env

echo ✅ Configuration created!
echo.
echo 🎯 Test the integration:
echo node bin\mcp-swarm.cjs "Build a simple todo app"
echo.
echo The system will now use your local LM Studio model instead of mock responses.
echo Expected performance: 2-4x faster with GPU acceleration on RTX GPUs.
