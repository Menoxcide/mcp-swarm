export default {
  name: 'evolver',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Improve last agent prompt by 20%";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Overwrites agent .ts file - for now just write to a sample file
    await explorer.writeFile('agents/improved_agent.ts', response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
