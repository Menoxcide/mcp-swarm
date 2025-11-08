# MCP-Swarm

Free, local-first, NVIDIA GPU-powered multi-agent system using MCP servers, persistent sandbox, live UI, and self-evolution.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run a task
npx ts-node core/engine.ts "Build a dashboard app"

# Start the live UI
npm run ui
```

## 📁 Project Structure

```
mcp-swarm/
├── core/              # Engine, discovery, config
├── agents/            # AI agent implementations
├── plugins/           # Auto-commit, deploy plugins
├── ui/                # Live web interface
├── sandbox/           # Persistent workspace
├── extensions/        # Cursor IDE extension
├── models/            # LM Studio configs
└── bin/               # CLI executable
```

## 🤖 Agents

- **market_researcher**: Competitor analysis
- **product_strategist**: Product planning
- **system_architect**: Architecture design
- **mcp_engineer**: MCP server development
- **ui_ux_designer**: Interface design
- **devops_engineer**: Infrastructure automation
- **qa_tester**: Quality assurance
- **growth_hacker**: Marketing strategies
- **critic**: Code review
- **evolver**: Self-improvement
- **benchmark**: Performance testing

## 🔧 MCP Servers

Pre-configured with 50+ MCP servers including:
- GitHub, GitLab, Terminal, Filesystem
- Slack, Discord, Linear, Jira
- Postgres, MySQL, Redis, Vector DBs
- Docker, Kubernetes, Terraform
- AI services, Search, Notifications

## 🎨 Live UI

Real-time dashboard at `http://localhost:3000` showing:
- Agent execution status
- Sandbox file browser
- Performance metrics
- MCP server registry

## 🔌 Cursor Extension

VSIX package available for seamless IDE integration:
- Command palette: `MCP Swarm: Run Task`
- Sidebar views: Explorer, Debugger, Registry, Monitor
- Composer integration: `@swarm` prefix
- Tool sets for scoped workflows

## 🏗️ Architecture

- **Local-first**: Runs entirely on your machine
- **GPU-accelerated**: LM Studio integration for NVIDIA GPUs
- **Self-evolving**: Critic/evolver agents improve the system
- **Extensible**: Plugin system for custom automation
- **Free**: No API keys required, uses open models

## 📋 Requirements

- Node.js 18+
- NVIDIA GPU (RTX 20/30/40/50 series recommended)
- LM Studio (free app for local LLMs)
- Cursor IDE 0.51+ (optional, for extension)

## 🎯 Vision

User runs: `npx mcp-swarm "Build a viral AI dashboard"`

System automatically:
1. Discovers 10+ free MCP servers
2. Spins persistent sandbox
3. Runs 8+ parallel expert agents
4. Shows live UI at localhost:3000
5. Auto-commits and deploys
6. Uses only free models + local GPU
7. Integrates deeply with Cursor IDE

## 📄 License

MIT - Free for all uses
