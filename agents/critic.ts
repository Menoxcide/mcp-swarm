export default {
  name: 'critic',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Find 3 bugs in last output";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /review/fixes.md
    const outputPath = 'review/fixes.md';
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
