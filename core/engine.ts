import { readdir } from 'fs/promises';
import { join } from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { discoverMCPNode } from './discover.js';
import { startLiveUI } from '../ui/server.js';
import { createModel } from './model.js';

interface Agent {
  name: string;
  run: (state: any, context: any) => Promise<any>;
}

export async function runPipeline(task: string) {
  console.log('🚀 Starting MCP Swarm pipeline...');

  // Initialize MCP discovery
  const { explorer } = await discoverMCPNode({ task });
  // Note: UI server commented out for now to avoid hanging
  // startLiveUI(explorer);

  // Create model instance
  const model = createModel();

  // Load agents
  const agentFiles = await readdir('agents');
  const agents: Agent[] = [];

  for (const file of agentFiles) {
    if (file.endsWith('.ts') && file !== 'template.ts') {
      try {
        const { default: agent } = await import(join('../agents', file));
        agents.push(agent);
      } catch (error) {
        console.warn(`Failed to load agent ${file}:`, error);
      }
    }
  }

  // Run agents sequentially for now
  const state = {
    task,
    phase: 'start',
    results: {},
    explorer
  };

  // Run all agents for complete application development
  const agentsToRun = agents.filter(agent => agent.name !== 'template');

  for (const agent of agentsToRun) {
    console.log(`🤖 Running agent: ${agent.name} on task: "${state.task}"`);
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Agent timeout')), 10000)
      );
      const result = await Promise.race([
        agent.run(state, { explorer, model }),
        timeoutPromise
      ]);
      state.results = { ...state.results, ...result.results };
      state.phase = agent.name;
      console.log(`✅ Agent ${agent.name} completed - generated ${Object.keys(result.results).length} outputs`);
    } catch (error) {
      console.error(`❌ Agent ${agent.name} failed:`, error instanceof Error ? error.message : String(error));
    }
  }

  console.log('Pipeline completed:', state.results);
  return state;
}

// Global state for real-time updates
let currentExecution: {
  task: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  agents: Array<{
    name: string;
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
    description: string;
  }>;
  results: any;
} = {
  task: '',
  status: 'idle',
  agents: [],
  results: {}
};

let io: Server;

// Queue system for sequential agent execution to prevent timeouts
class AgentQueue {
  private queue: Array<{ agent: Agent; index: number }> = [];
  private running = false;
  private concurrency = 2; // Run 2 agents at a time to balance speed and resource usage

  add(agent: Agent, index: number) {
    this.queue.push({ agent, index });
  }

  async process(state: any, agents: Agent[], io?: Server) {
    if (this.running) return;
    this.running = true;

    const processBatch = async () => {
      const batch = this.queue.splice(0, this.concurrency);
      if (batch.length === 0) {
        this.running = false;
        return;
      }

      const promises = batch.map(async ({ agent, index }) => {
        console.log(`🤖 Running agent: ${agent.name} on task: "${state.task}"`);

        // Update agent status to running
        currentExecution.agents[index].status = 'running';
        currentExecution.agents[index].progress = 10;
        io?.emit('agent-update', {
          agent: agent.name,
          status: 'running',
          progress: 10
        });

        try {
          const model = createModel();
          // Add timeout for individual agent calls
          const agentPromise = agent.run(state, { explorer: state.explorer, model });
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Agent ${agent.name} timeout after 30s`)), 60000)
          );
          const result = await Promise.race([agentPromise, timeoutPromise]);

          state.results = { ...state.results, ...result.results };
          state.phase = agent.name;

          // Update agent status to completed
          currentExecution.agents[index].status = 'completed';
          currentExecution.agents[index].progress = 100;
          io?.emit('agent-update', {
            agent: agent.name,
            status: 'completed',
            progress: 100
          });

          console.log(`✅ Agent ${agent.name} completed - generated ${Object.keys(result.results).length} outputs`);
        } catch (error) {
          console.error(`❌ Agent ${agent.name} failed:`, error instanceof Error ? error.message : String(error));

          // Update agent status to error
          currentExecution.agents[index].status = 'error';
          currentExecution.agents[index].progress = 0;
          io?.emit('agent-update', {
            agent: agent.name,
            status: 'error',
            progress: 0
          });
        }
      });

      await Promise.all(promises);
      await processBatch(); // Process next batch
    };

    await processBatch();
  }
}

// API Server for React frontend
async function startAPIServer() {
  const app = express();
  const server = createServer(app);
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json());

  // API endpoint to run tasks
  app.post('/api/run-task', async (req, res) => {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    // Don't allow concurrent executions
    if (currentExecution.status === 'running') {
      return res.status(409).json({ error: 'Task already running' });
    }

    try {
      // Reset execution state
      currentExecution = {
        task,
        status: 'running',
        agents: [],
        results: {}
      };

      // Broadcast start
      io.emit('execution-start', { task });

      // Run pipeline asynchronously
      runPipelineWithUpdates(task).then((result) => {
        currentExecution.status = 'completed';
        currentExecution.results = result.results;
        io.emit('execution-complete', currentExecution);
      }).catch((error: any) => {
        currentExecution.status = 'error';
        io.emit('execution-error', { error: error.message });
      });

      res.json({ message: 'Task started', task });

    } catch (error: any) {
      currentExecution.status = 'error';
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  });

  // Get current execution status
  app.get('/api/status', (req, res) => {
    res.json(currentExecution);
  });

  // WebSocket connection handling
  io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);

    // Send current status on connection
    socket.emit('status', currentExecution);

    socket.on('disconnect', () => {
      console.log('Frontend disconnected:', socket.id);
    });
  });

  const PORT = 3002; // Use 3002 for API, 3000 for UI
  server.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
  });

  return server;
}

// Enhanced pipeline with real-time updates and queue system
export async function runPipelineWithUpdates(task: string) {
console.log('🚀 Starting MCP Swarm pipeline with real-time updates...');

// Initialize MCP discovery
const { explorer } = await discoverMCPNode({ task });
const model = createModel();

  // Start live UI for progress monitoring
  console.log('🎨 Starting live UI dashboard...');
  const { startLiveUI } = await import('./../ui/server.js');
  startLiveUI(explorer);

// Load agents
const agentFiles = await readdir('agents');
console.log(`📋 Loading ${agentFiles.filter(f => f.endsWith('.ts') && f !== 'template.ts').length} agents...`);
  const agents: Agent[] = [];

for (const file of agentFiles) {
if (file.endsWith('.ts') && file !== 'template.ts') {
try {
const { default: agent } = await import(pathToFileURL(join('./agents', file)).href);
  agents.push(agent);
console.log(`📦 Loaded agent: ${agent.name}`);
} catch (error) {
    console.warn(`⚠️ Failed to load agent ${file}:`, error);
    }
    }
}

// Initialize agent statuses
currentExecution.agents = agents.map(agent => ({
name: agent.name,
status: 'idle' as const,
  progress: 0,
    description: getAgentDescription(agent.name)
}));

// Initialize state
const state = {
task,
phase: 'start',
  results: {},
    explorer
};

console.log(`🎯 Starting ${agents.length} agents in queued batches of ${Math.min(2, agents.length)}...`);

// Use queue system instead of parallel execution
const queue = new AgentQueue();
agents.forEach((agent, index) => queue.add(agent, index));
await queue.process(state, agents, io);

console.log('🎉 Pipeline completed:', Object.keys(state.results).length, 'outputs generated');
return state;
}

function getAgentDescription(agentName: string): string {
  const descriptions: { [key: string]: string } = {
    market_researcher: 'Analyzing market opportunities and competitors',
    product_strategist: 'Planning product strategy and roadmap',
    system_architect: 'Designing technical architecture',
    mcp_engineer: 'Building MCP servers and integrations',
    ui_ux_designer: 'Creating user interface and experience',
    devops_engineer: 'Setting up deployment and infrastructure',
    qa_tester: 'Testing security and quality assurance',
    growth_hacker: 'Planning marketing and growth strategies',
    critic: 'Code review and quality assessment',
    evolver: 'Self-improvement and optimization',
    benchmark: 'Performance testing and metrics'
  };
  return descriptions[agentName] || 'Processing task';
}

// Main execution
async function main() {
  // Start API server first
  await startAPIServer();

  // If called with arguments, run directly
  const task = process.argv[2];
  if (task) {
  await runPipelineWithUpdates(task);
  process.exit(0);
  } else {
    console.log('MCP-Swarm API server started. Use POST /api/run-task to execute tasks.');
  }
}

import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isMainModule) {
  main().catch(console.error);
}
