// Simple mock model for demonstration
// In production, this would connect to LM Studio or other LLM APIs

export class MockModel {
  async invoke(messages: any[]) {
    // Simulate AI responses based on task
    const lastMessage = messages[messages.length - 1]?.content || '';
    const task = lastMessage.toLowerCase();

    let response = 'Task completed successfully.';

    if (task.includes('analyze') && task.includes('crewai')) {
      response = JSON.stringify({
        pricing: { crewai: '$49/mo', autogen: 'Free', langgraph: '$0' },
        stars: { crewai: 1200, autogen: 25000, langgraph: 8900 },
        weaknesses: ['Complex setup', 'Limited customization', 'Vendor lock-in']
      });
    } else if (task.includes('mvp features')) {
      response = '- Real-time collaboration\n- Plugin marketplace\n- Auto-deployment\n- GPU acceleration\nPaid: Enterprise support, custom MCPs';
    } else if (task.includes('architecture')) {
      response = 'Fly.io free tier + SQLite + Local GPU + MCP proxy';
    } else if (task.includes('mcp')) {
      response = '// File search MCP\nconst search = (query) => files.filter(f => f.includes(query));';
    } else if (task.includes('react') && task.includes('tailwind')) {
      response = 'export default function Dashboard() { return <div className="p-4">Dashboard</div>; }';
    } else if (task.includes('dockerfile')) {
      response = 'FROM node:18\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]';
    } else if (task.includes('fuzz')) {
      response = 'Security test passed. No vulnerabilities found.';
    } else if (task.includes('threads')) {
      response = 'Thread 1: MCP-Swarm revolutionizes AI agents...';
    } else if (task.includes('bugs')) {
      response = 'Bug 1: Missing error handling\nBug 2: Race condition in file writes\nBug 3: Memory leak in agent loop';
    } else if (task.includes('improve')) {
      response = 'Add retry logic and better error messages';
    } else if (task.includes('trials')) {
      response = JSON.stringify({
        trials: [1200, 1150, 1180],
        average: 1177,
        speedup: '2.3x'
      });
    }

    return {
      content: response,
      usage: { tokens: 150 }
    };
  }
}

export const createModel = () => new MockModel();
