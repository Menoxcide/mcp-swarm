export default {
  name: 'mcp_engineer',
  async run(state: any, { explorer, model }: any) {
    console.log(`🔧 MCP Engineer building MCPs for: "${state.task}"`);

    // Build file search MCP
    const fileSearchCode = `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
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
            \`Unknown tool: \${name}\`
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
            text: \`Found \${results.length} files matching "\${pattern}":\\n\${results.join('\\n')}\`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: \`Error searching files: \${error.message}\`,
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
            text: \`Error reading file: \${error.message}\`,
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
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    return new RegExp(\`^\${regex}$\`).test(filename);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('File Search MCP server running on stdio');
  }
}

// Run the server if executed directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const server = new FileSearchServer();
  server.run().catch(console.error);
}

export { FileSearchServer };
`;

    // Build image generation MCP
    const imageGenCode = `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';

class ImageGenServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'image-gen-mcp',
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
            name: 'generate_placeholder',
            description: 'Generate a placeholder image description (canvas not available in this env)',
            inputSchema: {
              type: 'object',
              properties: {
                description: {
                  type: 'string',
                  description: 'Description of the image to generate',
                },
                width: {
                  type: 'number',
                  description: 'Image width in pixels',
                  default: 512,
                },
                height: {
                  type: 'number',
                  description: 'Image height in pixels',
                  default: 512,
                },
              },
              required: ['description'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'generate_placeholder':
          return await this.generatePlaceholder(args);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            \`Unknown tool: \${name}\`
          );
      }
    });
  }

  private async generatePlaceholder(args: any) {
    const description = args.description;
    const width = args.width || 512;
    const height = args.height || 512;

    try {
      const placeholderText = \`Placeholder Image: \${description}\\nDimensions: \${width}x\${height}\\n\\nThis is a placeholder for image generation. In a full implementation, this would generate an actual image file.\`;

      // In a real implementation, this would generate an actual image
      // For now, we'll create a text description file
      await fs.writeFile('generated_image.txt', placeholderText);

      return {
        content: [
          {
            type: 'text',
            text: \`Image placeholder generated: \${description} (\${width}x\${height})\\nSaved description to generated_image.txt\`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: \`Error generating image placeholder: \${error.message}\`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Image Generation MCP server running on stdio');
  }
}

// Run the server if executed directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const server = new ImageGenServer();
  server.run().catch(console.error);
}

export { ImageGenServer };
`;

    console.log(`📝 Creating MCP servers...`);
    await explorer.writeFile('mcp/file_search.ts', fileSearchCode);
    await explorer.writeFile('mcp/image_gen.ts', imageGenCode);

    return {
      results: {
        ...state.results,
        [this.name]: 'Created file_search.ts and image_gen.ts MCP servers'
      }
    };
  }
};
