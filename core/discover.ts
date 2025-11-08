import fs from 'fs/promises';
import path from 'path';

const MASTER_MCP_LIST = [
  {
    "name": "GitHub MCP",
    "url": "https://api.github.com/openapi.json",
    "auth": "oauth",
    "enabled": true,
    "description": "Repo ops, PRs, issues"
  },
  {
    "name": "Terminal MCP",
    "url": "local",
    "auth": "none",
    "enabled": true,
    "description": "Shell access"
  },
  {
    "name": "Filesystem MCP",
    "url": "local",
    "auth": "none",
    "enabled": true,
    "description": "File read/write"
  }
];

// Simple mock explorer for now
class MockExplorer {
  rootDir = './sandbox';

  async writeFile(filePath: string, content: string) {
    const fullPath = path.join(this.rootDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  async listFiles(dir: string = '') {
    try {
      const fullPath = path.join(this.rootDir, dir);
      const files = await fs.readdir(fullPath);
      return files;
    } catch {
      return [];
    }
  }
}

export async function discoverMCPNode(state: any) {
  const configPath = path.join('sandbox', 'mcp-config.json');
  let config: any[] = [];
  try {
    config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  }
  catch {
    config = MASTER_MCP_LIST;
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  const explorer = new MockExplorer();
  return { explorer };
}
