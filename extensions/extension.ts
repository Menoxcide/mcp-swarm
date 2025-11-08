import * as vscode from 'vscode';
import { spawn } from 'child_process';
import path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('MCP Swarm extension activated');

    // Register commands
    const runTaskCommand = vscode.commands.registerCommand('swarm.runTask', async () => {
        const task = await vscode.window.showInputBox({
            prompt: 'Enter MCP Swarm task',
            placeHolder: 'Build a dashboard app'
        });

        if (task) {
            await runSwarmTask(task);
        }
    });

    const addMCPCommand = vscode.commands.registerCommand('swarm.addMCP', async () => {
        // Show MCP discovery UI
        const mcpName = await vscode.window.showInputBox({
            prompt: 'MCP Server Name',
            placeHolder: 'GitHub MCP'
        });

        if (mcpName) {
            vscode.window.showInformationMessage(`MCP ${mcpName} added to registry`);
        }
    });

    const debugAgentCommand = vscode.commands.registerCommand('swarm.debugAgent', () => {
        // Open agent debugger view
        vscode.window.showInformationMessage('Agent debugger opened');
    });

    const deployCommand = vscode.commands.registerCommand('swarm.deploy', async () => {
        // Deploy to Fly.io
        const result = await vscode.window.showInformationMessage(
            'Deploy to Fly.io?',
            'Yes', 'No'
        );

        if (result === 'Yes') {
            await runDeploy();
        }
    });

    // Register tree data providers for views
    const swarmExplorerProvider = new SwarmExplorerProvider();
    vscode.window.registerTreeDataProvider('swarmExplorer', swarmExplorerProvider);

    const swarmDebuggerProvider = new SwarmDebuggerProvider();
    vscode.window.registerTreeDataProvider('swarmDebugger', swarmDebuggerProvider);

    const swarmRegistryProvider = new SwarmRegistryProvider();
    vscode.window.registerTreeDataProvider('swarmRegistry', swarmRegistryProvider);

    const swarmMonitorProvider = new SwarmMonitorProvider();
    vscode.window.registerTreeDataProvider('swarmMonitor', swarmMonitorProvider);

    // Register chat participants for Composer integration
    const swarmChatParticipant = vscode.chat.createChatParticipant('swarm', async (request, context, response, token) => {
        const task = request.prompt;
        await runSwarmTask(task, response);
    });

    context.subscriptions.push(
        runTaskCommand,
        addMCPCommand,
        debugAgentCommand,
        deployCommand,
        swarmChatParticipant
    );
}

async function runSwarmTask(task: string, chatResponse?: vscode.ChatResponseStream) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const swarmPath = path.join(workspaceFolder.uri.fsPath, 'bin', 'mcp-swarm.js');

    return new Promise<void>((resolve, reject) => {
        const child = spawn('node', [swarmPath, task], {
            cwd: workspaceFolder.uri.fsPath,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        child.stdout?.on('data', (data) => {
            const output = data.toString();
            if (chatResponse) {
                chatResponse.markdown(output);
            } else {
                console.log(output);
            }
        });

        child.stderr?.on('data', (data) => {
            const error = data.toString();
            if (chatResponse) {
                chatResponse.markdown(`Error: ${error}`);
            } else {
                console.error(error);
            }
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`MCP Swarm exited with code ${code}`));
            }
        });
    });
}

async function runDeploy() {
    // Implementation for Fly.io deployment
    vscode.window.showInformationMessage('Deploying to Fly.io...');
}

class SwarmExplorerProvider implements vscode.TreeDataProvider<SwarmItem> {
    getTreeItem(element: SwarmItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SwarmItem): Thenable<SwarmItem[]> {
        if (!element) {
            // Root level - show sandbox files
            return Promise.resolve([
                new SwarmItem('sample-file.txt', 'File', vscode.TreeItemCollapsibleState.None)
            ]);
        }
        return Promise.resolve([]);
    }
}

class SwarmDebuggerProvider implements vscode.TreeDataProvider<SwarmItem> {
    getTreeItem(element: SwarmItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SwarmItem): Thenable<SwarmItem[]> {
        // Show running agents
        return Promise.resolve([
            new SwarmItem('market_researcher', 'Agent', vscode.TreeItemCollapsibleState.None),
            new SwarmItem('product_strategist', 'Agent', vscode.TreeItemCollapsibleState.None)
        ]);
    }
}

class SwarmRegistryProvider implements vscode.TreeDataProvider<SwarmItem> {
    getTreeItem(element: SwarmItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SwarmItem): Thenable<SwarmItem[]> {
        // Show available MCPs
        return Promise.resolve([
            new SwarmItem('GitHub MCP', 'MCP Server', vscode.TreeItemCollapsibleState.None),
            new SwarmItem('Terminal MCP', 'MCP Server', vscode.TreeItemCollapsibleState.None)
        ]);
    }
}

class SwarmMonitorProvider implements vscode.TreeDataProvider<SwarmItem> {
    getTreeItem(element: SwarmItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SwarmItem): Thenable<SwarmItem[]> {
        // Show performance metrics
        return Promise.resolve([
            new SwarmItem('GPU Usage: 45%', 'Metric', vscode.TreeItemCollapsibleState.None),
            new SwarmItem('Tokens: 1,234', 'Metric', vscode.TreeItemCollapsibleState.None)
        ]);
    }
}

class SwarmItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly type: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${type}: ${label}`;
        this.description = type;
    }
}

export function deactivate() {
    console.log('MCP Swarm extension deactivated');
}
