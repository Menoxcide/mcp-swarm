#!/bin/bash

# MCP-Swarm LM Studio Setup Script
echo "🚀 Setting up MCP-Swarm with LM Studio integration"
echo ""

# Check if LM Studio is running
echo "📡 Checking if LM Studio is running on localhost:1234..."
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo "✅ LM Studio server detected!"
else
    echo "❌ LM Studio server not found on localhost:1234"
    echo ""
    echo "Please start LM Studio and:"
    echo "1. Load a model (e.g., Llama 3.2 8B, Grok-1)"
    echo "2. Start the local server on port 1234"
    echo "3. Enable GPU acceleration if available"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Create .env file for configuration
echo "📝 Creating .env configuration file..."
cat > .env << EOF
# LM Studio Configuration
USE_LM_STUDIO=true
LM_STUDIO_URL=http://localhost:1234/v1
# LM_STUDIO_API_KEY=your_api_key_here  # Optional, usually not needed for local LM Studio

# MCP-Swarm Configuration
NODE_ENV=development
EOF

echo "✅ Configuration created!"
echo ""
echo "🎯 Test the integration:"
echo "node bin/mcp-swarm.cjs \"Build a simple todo app\""
echo ""
echo "The system will now use your local LM Studio model instead of mock responses."
echo "Expected performance: 2-4x faster with GPU acceleration on RTX GPUs."
