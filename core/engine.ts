import { readdir } from 'fs/promises';
import { join } from 'path';
import { discoverMCPNode } from './discover';
import { startLiveUI } from '../ui/server';
import { createModel } from './model';

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
        const { default: agent } = await import(join('../agents', file.replace('.ts', '')));
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

  // Sort agents by priority (first 3 for demo)
  const priorityAgents = ['market_researcher', 'product_strategist', 'system_architect'];
  const agentsToRun = agents.filter(agent => priorityAgents.includes(agent.name));

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

// Main execution
async function main() {
  const task = process.argv[2] || 'Build a sample app';
  await runPipeline(task);
}

if (require.main === module) {
  main().catch(console.error);
}
