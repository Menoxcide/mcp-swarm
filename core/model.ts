// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// LM Studio integration for local AI models
export class LMStudioModel {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'http://localhost:1234/v1', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async invoke(messages: any[], agentName?: string) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    console.log(`🤖 LM Studio processing for ${agentName || 'agent'}: "${lastMessage.substring(0, 100)}..."`);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          model: 'local-model', // LM Studio accepts any model name
          messages: messages.map(msg => ({
            role: msg.role || 'user',
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`LM Studio API error: ${response.status} ${response.statusText}`);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response generated';

      console.log(`📤 LM Studio response (${content.length} chars): ${content.substring(0, 100)}...`);

      return {
        content,
        usage: {
          tokens: data.usage?.total_tokens || Math.ceil(content.length / 4)
        }
      };
    } catch (error) {
      console.error(`❌ LM Studio error:`, error);
      // Fallback to mock response
      console.log(`🔄 Falling back to mock response`);
      return new MockModel().invoke(messages, agentName);
    }
  }
}

// Simple mock model for demonstration/fallback
export class MockModel {
  async invoke(messages: any[], agentName?: string) {
    // Simulate AI responses based on task and agent
    const lastMessage = messages[messages.length - 1]?.content || '';
    const task = lastMessage.toLowerCase();

    console.log(`🤖 Model processing for ${agentName || 'unknown agent'}: "${lastMessage}"`);

    let response = `Task "${lastMessage}" completed successfully. This is a mock response - in production this would use a real LLM.`;

    // Agent-specific responses
    if (agentName === 'market_researcher') {
      response = JSON.stringify({
        competitors: ['CrewAI', 'AutoGen', 'LangGraph', 'SmolAgents'],
        market_size: '$2.3B AI agents market',
        trends: ['Multi-agent systems', 'MCP protocols', 'GPU acceleration'],
        opportunities: ['Free tier dominance', 'Cursor IDE integration', 'Local-first architecture']
      }, null, 2);
    }
    else if (agentName === 'product_strategist') {
      response = `## Product Strategy for "${lastMessage}"

### MVP Features
- Real-time agent collaboration
- Plugin marketplace with 50+ MCP servers
- Auto-deployment to Fly.io
- GPU acceleration via LM Studio
- Cursor IDE deep integration
- Self-evolving critic/evolver agents

### Monetization Model
- **Free Tier**: Basic agent usage, limited MCP servers
- **Pro Tier**: $29/mo - Unlimited agents, full MCP access, priority support
- **Enterprise Tier**: $99/mo - Custom agents, white-label, SLA guarantees

### Target Market
- **Primary**: AI developers and researchers
- **Secondary**: DevOps teams, product managers, technical founders
- **Tertiary**: Enterprises needing AI automation

### Go-to-Market Strategy
1. **Launch**: Open source release with Cursor integration
2. **Growth**: Community-driven plugin ecosystem
3. **Scale**: Enterprise features and support
4. **Sustain**: Recurring revenue from Pro/Enterprise tiers`;
    }
    else if (agentName === 'system_architect') {
      response = `## System Architecture for "${lastMessage}"

### Frontend Layer
- **Cursor IDE Extension**: VSIX package with Composer hooks
- **Live UI Dashboard**: Express + Socket.IO at localhost:3000
- **Agent Debugger**: Real-time execution monitoring

### Agent Layer
- **11 Specialized Agents**: Market research, product strategy, architecture, etc.
- **MCP Protocol**: 50+ server integrations (GitHub, Slack, databases, etc.)
- **Orchestration Engine**: LangGraph-based workflow management

### Backend Layer
- **Sandbox Environment**: Persistent workspace with git integration
- **Plugin System**: Auto-commit, auto-deploy, custom triggers
- **Model Integration**: LM Studio with GPU acceleration

### Infrastructure
- **Fly.io Free Tier**: Global deployment with zero cost
- **SQLite Database**: Local data persistence
- **File System**: Git-based version control for all outputs

### Security & Performance
- **Local-First**: No API keys, runs entirely offline
- **GPU Acceleration**: RTX series support via CUDA
- **Sandbox Isolation**: Secure agent execution environment`;
    }

    console.log(`📤 Model response (${response.length} chars): ${response.substring(0, 100)}...`);

    return {
      content: response,
      usage: { tokens: Math.ceil(response.length / 4) }
    };
  }
}

// Configuration for model selection
const USE_LM_STUDIO = process.env.USE_LM_STUDIO === 'true' || process.env.LM_STUDIO_URL;
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
const LM_STUDIO_API_KEY = process.env.LM_STUDIO_API_KEY;

export const createModel = () => {
  if (USE_LM_STUDIO) {
    console.log(`🚀 Using LM Studio at ${LM_STUDIO_URL}`);
    return new LMStudioModel(LM_STUDIO_URL, LM_STUDIO_API_KEY);
  } else {
    console.log(`🎭 Using mock model (set USE_LM_STUDIO=true or LM_STUDIO_URL to use LM Studio)`);
    return new MockModel();
  }
};
