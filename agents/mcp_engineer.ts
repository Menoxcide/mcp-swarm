export default {
  name: 'mcp_engineer',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Build 2 new MCPs: file_search, image_gen";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /mcp/*.ts - create sample MCP files
    await explorer.writeFile('mcp/file_search.ts', `// File search MCP\n${response.content}`);
    await explorer.writeFile('mcp/image_gen.ts', `// Image generation MCP\n${response.content}`);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
