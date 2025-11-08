#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const task = args.join(' ') || 'Build a sample app';

  console.log('🚀 Starting MCP Swarm...');
  console.log(`Task: ${task}`);

  // Run the compiled JavaScript directly
  const enginePath = path.join(__dirname, '..', 'dist', 'core', 'engine.js');

  const child = spawn('node', [enginePath, task], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  child.on('close', (code) => {
    console.log(`MCP Swarm exited with code ${code}`);
  });

  child.on('error', (error) => {
    console.error('Failed to start MCP Swarm:', error);
    // Fallback: try running TypeScript directly
    runWithTsNode(task);
  });
}

async function runWithTsNode(task) {
  const enginePath = path.join(__dirname, '..', 'core', 'engine.ts');

  const child = spawn('npx', ['ts-node', enginePath, task], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  child.on('close', (code) => {
    console.log(`MCP Swarm (fallback) exited with code ${code}`);
  });

  child.on('error', (error) => {
    console.error('Failed to start MCP Swarm (fallback):', error);
  });
}

main().catch(console.error);
