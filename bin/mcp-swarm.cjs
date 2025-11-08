#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Auto-open browser function
function openBrowser(url) {
  let command, args;
  if (process.platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (process.platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }
  spawn(command, args, { stdio: 'ignore', detached: true });
}

async function main() {
  const args = process.argv.slice(2);
  const task = args.join(' ') || 'Build a sample app';

  console.log('🚀 Starting MCP Swarm...');
  console.log(`Task: ${task}`);

  // Run with ts-node directly
  runWithTsNode(task);
}

async function runWithTsNode(task) {
  const enginePath = path.join(__dirname, '..', 'core', 'engine.ts');

  const child = spawn('node', ['--loader', 'ts-node/esm', enginePath, task], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  child.on('close', (code) => {
    console.log(`MCP Swarm (fallback) exited with code ${code}`);
  });

  child.on('error', (error) => {
    console.error('Failed to start MCP Swarm (fallback):', error);
  });

  // Auto-open browser after a delay to allow UI server to start
  setTimeout(() => {
    console.log('🌐 Opening browser to view progress...');
    openBrowser('http://localhost:3000');
  }, 3000);
}

main().catch(console.error);
