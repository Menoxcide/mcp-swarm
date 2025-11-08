export default {
  name: 'example_agent',
  async run(state: any, { explorer, model }: any) {
    // Template for all agents
    // state: { task, phase, results, explorer }
    // explorer: MCPSandboxExplorer instance
    // model: Language model instance

    const response = await model.invoke([
      { role: 'user', content: `Task: ${state.task}` }
    ]);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
