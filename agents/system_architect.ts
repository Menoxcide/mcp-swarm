export default {
  name: 'system_architect',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Design zero-cost architecture with Fly.io free";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /arch/system.mmd
    const outputPath = 'arch/system.mmd';
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
