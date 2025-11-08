import React, { useState, useEffect } from 'react';
import { Bot, FileText, Settings, Activity, Zap, Users, BarChart3 } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  description: string;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified?: string;
}

function App() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Market Researcher', status: 'idle', progress: 0, description: 'Analyzing market opportunities' },
    { id: '2', name: 'Product Strategist', status: 'idle', progress: 0, description: 'Planning product roadmap' },
    { id: '3', name: 'System Architect', status: 'idle', progress: 0, description: 'Designing technical architecture' },
    { id: '4', name: 'UI/UX Designer', status: 'running', progress: 65, description: 'Creating user interface' },
    { id: '5', name: 'MCP Engineer', status: 'completed', progress: 100, description: 'Building MCP servers' },
    { id: '6', name: 'DevOps Engineer', status: 'idle', progress: 0, description: 'Setting up deployment' },
  ]);

  const [files, setFiles] = useState<FileItem[]>([
    { name: 'research', type: 'folder' },
    { name: 'plan', type: 'folder' },
    { name: 'arch', type: 'folder' },
    { name: 'mcp', type: 'folder' },
    { name: 'ui', type: 'folder' },
    { name: 'README.md', type: 'file', size: '2.8KB', modified: '2 hours ago' },
    { name: 'package.json', type: 'file', size: '1.4KB', modified: '1 hour ago' },
  ]);

  const [currentTask, setCurrentTask] = useState('Build the next big thing');
  const [isRunning, setIsRunning] = useState(false);

  const runTask = () => {
    setIsRunning(true);
    // Simulate agent execution
    setTimeout(() => {
      setAgents(agents.map(agent => ({
        ...agent,
        status: Math.random() > 0.3 ? 'completed' : 'running',
        progress: Math.floor(Math.random() * 100)
      })));
      setIsRunning(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'completed': return <Zap className="w-4 h-4" />;
      case 'error': return <Bot className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MCP-Swarm</h1>
                <p className="text-sm text-gray-600">AI Agent Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">11 Agents Online</span>
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Deploy to Fly.io
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Task Input */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Execution</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your task..."
                />
                <button
                  onClick={runTask}
                  disabled={isRunning}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {isRunning ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Run Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Agent Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(agent.status)}`}>
                        {getStatusIcon(agent.status)}
                        <span className="capitalize">{agent.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${agent.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{agent.progress}% complete</span>
                      <span>ETA: {Math.max(0, Math.floor((100 - agent.progress) / 10))}min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GPU Usage</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Memory</span>
                  <span className="font-medium">1.2GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tokens/Second</span>
                  <span className="font-medium">45.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Agents</span>
                  <span className="font-medium">{agents.filter(a => a.status === 'running').length}</span>
                </div>
              </div>
            </div>

            {/* File Explorer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sandbox Files</h2>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    {file.type === 'folder' ? (
                      <FileText className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700">{file.name}</span>
                    {file.size && (
                      <span className="text-xs text-gray-500 ml-auto">{file.size}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MCP Servers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">MCP Servers</h2>
              <div className="space-y-2">
                {['GitHub', 'GitLab', 'Slack', 'Docker', 'Kubernetes'].map((server) => (
                  <div key={server} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{server}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;