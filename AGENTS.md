# MCP-Swarm Agents Documentation

This file serves as the ground truth for all agent definitions, commands, style, and structure in the mcp-swarm project.

## Agent Architecture

All agents follow the template structure:
```typescript
export default {
  name: 'agent_name',
  async run(state: any, { explorer, model }: any) {
    // Agent logic here
    return { results: { ...state.results, [this.name]: response } };
  }
};
```

## Core Agents

### market_researcher
**Purpose**: Competitor analysis and market intelligence
**Prompt**: "Analyze CrewAI, Autogen, LangGraph. Output JSON: {pricing, stars, weaknesses}"
**Output**: `/research/competitors.json`
**MCPs Used**: GitHub MCP, Tavily MCP, Brave Search MCP

### product_strategist
**Purpose**: Product strategy and roadmap planning
**Prompt**: "Define 3 MVP features + paid upgrade path"
**Output**: `/plan/roadmap.md`
**MCPs Used**: Notion MCP, Linear MCP, Atlassian MCP

### system_architect
**Purpose**: Technical architecture design
**Prompt**: "Design zero-cost architecture with Fly.io free"
**Output**: `/arch/system.mmd`
**MCPs Used**: Docker MCP, Kubernetes MCP, Terraform MCP

### mcp_engineer
**Purpose**: MCP server development and integration
**Prompt**: "Build 2 new MCPs: file_search, image_gen"
**Output**: `/mcp/*.ts`
**MCPs Used**: GitHub MCP, Filesystem MCP, Terminal MCP

### ui_ux_designer
**Purpose**: User interface and experience design
**Prompt**: "Generate React + Tailwind dashboard"
**Output**: `/ui/App.tsx`
**MCPs Used**: Filesystem MCP, Terminal MCP, Brave Search MCP

### devops_engineer
**Purpose**: Infrastructure and deployment automation
**Prompt**: "Write Dockerfile, fly.toml, GitHub Actions"
**Output**: `/deploy/*`
**MCPs Used**: Docker MCP, GitHub MCP, Terminal MCP

### qa_tester
**Purpose**: Quality assurance and security testing
**Prompt**: "Fuzz MCPs, test sandbox escape"
**Output**: `/test/report.md`
**MCPs Used**: Terminal MCP, Filesystem MCP, Semgrep MCP

### growth_hacker
**Purpose**: Marketing and growth strategies
**Prompt**: "Write 5 X threads + HN post"
**Output**: `/growth/*.md`
**MCPs Used**: Bluesky MCP, Brave Search MCP, NYTimes MCP

### critic
**Purpose**: Code review and quality assessment
**Prompt**: "Find 3 bugs in last output"
**Output**: `/review/fixes.md`
**MCPs Used**: Filesystem MCP, Git MCP, Semgrep MCP

### evolver
**Purpose**: Self-improvement and optimization
**Prompt**: "Improve last agent prompt by 20%"
**Output**: Overwrites agent .ts file
**MCPs Used**: Filesystem MCP, Git MCP

### benchmark
**Purpose**: Performance testing and metrics
**Prompt**: "Run 5 trials, measure speed"
**Output**: `/perf/report.json`
**MCPs Used**: Terminal MCP, Filesystem MCP, VictoriaMetrics MCP

## Agent Communication Style

All agents must follow these communication guidelines:

### Response Format
- Use clean, professional output with GitHub-flavored Markdown
- Never start responses with positive adjectives (good, great, excellent, etc.)
- Be concise, direct, and to the point
- Minimize output tokens while maintaining helpfulness
- One word answers when possible
- Avoid long introductions, explanations, or summaries

### Code Style
- TypeScript with strict typing
- Async/await for all operations
- Error handling with try/catch
- Functional programming patterns where appropriate
- Clear, descriptive variable names
- JSDoc comments for public APIs

### File Operations
- Always use absolute paths
- Validate file existence before operations
- Handle file encoding properly (UTF-8)
- Use atomic operations when possible
- Log all file changes

## MCP Integration Guidelines

### Authentication
- OAuth for services requiring user consent (GitHub, Google Drive, etc.)
- API keys for programmatic access (Slack, Zapier, etc.)
- Basic auth for databases and internal services
- Local auth for filesystem and terminal operations

### Error Handling
- Graceful degradation when MCPs are unavailable
- Retry logic with exponential backoff
- Clear error messages for debugging
- Fallback to alternative MCPs when possible

### Resource Management
- Close connections after use
- Implement rate limiting
- Cache results when appropriate
- Monitor resource usage

## Agent Development Workflow

1. **Planning**: Use product_strategist to define requirements
2. **Architecture**: Use system_architect to design solution
3. **Implementation**: Use specialized agents (mcp_engineer, ui_ux_designer, etc.)
4. **Testing**: Use qa_tester for validation
5. **Review**: Use critic for code quality assessment
6. **Optimization**: Use evolver for self-improvement
7. **Benchmarking**: Use benchmark for performance metrics

## Quality Assurance

- All agents must pass critic review before merging
- Benchmark results must show improvement over previous versions
- Security testing via qa_tester must pass
- Code must follow established patterns and style

## Evolution Process

The evolver agent continuously improves prompts and code:
- Analyzes performance metrics from benchmark
- Reviews critic feedback
- Implements improvements incrementally
- Tests changes before deployment
- Maintains backward compatibility

## Deployment Pipeline

1. Code changes trigger auto_commit plugin
2. devops_engineer generates deployment configs
3. auto_deploy plugin deploys to Fly.io
4. growth_hacker promotes new features
5. benchmark validates performance

## Monitoring and Maintenance

- VictoriaMetrics MCP for performance monitoring
- Sentry MCP for error tracking
- Axiom MCP for log analysis
- Regular critic reviews for code quality
- Automated benchmarking for performance regression detection
