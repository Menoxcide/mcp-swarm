import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

class FileSearchServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'file-search-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_files',
            description: 'Search for files in a directory using glob patterns',
            inputSchema: {
              type: 'object',
              properties: {
                pattern: {
                  type: 'string',
                  description: 'Glob pattern to search for (e.g., "*.ts", "**/*.md")',
                },
                directory: {
                  type: 'string',
                  description: 'Directory to search in (default: current directory)',
                  default: '.',
                },
              },
              required: ['pattern'],
            },
          },
          {
            name: 'read_file',
            description: 'Read the contents of a file',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the file to read',
                },
              },
              required: ['path'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'search_files':
          return await this.searchFiles(args);
        case 'read_file':
          return await this.readFile(args);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    });
  }

  private async searchFiles(args: any) {
    const pattern = args.pattern;
    const directory = args.directory || '.';

    try {
      const results = await this.globSearch(directory, pattern);
      return {
        content: [
          {
            type: 'text',
            text: `Found ${results.length} files matching "${pattern}":\n${results.join('\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching files: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async readFile(args: any) {
    const filePath = args.path;

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reading file: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async globSearch(dir: string, pattern: string): Promise<string[]> {
    // Simple glob implementation - in production use a proper glob library
    const results: string[] = [];

    async function search(currentDir: string): Promise<void> {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            await search(fullPath);
          } else if (entry.isFile()) {
            // Simple pattern matching
            if (this.matchesPattern(entry.name, pattern)) {
              results.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }

    await search(dir);
    return results;
  }

  private matchesPattern(filename: string, pattern: string): boolean {
    // Simple pattern matching - convert glob to regex
    const regex = pattern
      .replace(/**/g, '.*')
      .replace(/*/g, '[^/]*')
      .replace(/?/g, '.');
    return new RegExp(`^${regex}$`).test(filename);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('File Search MCP server running on stdio');
  }
}

// Run the server if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new FileSearchServer();
  server.run().catch(console.error);
}

export { FileSearchServer };
