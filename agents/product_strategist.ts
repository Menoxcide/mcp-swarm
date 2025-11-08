export default {
  name: 'product_strategist',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Define 3 MVP features + paid upgrade path";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /plan/roadmap.md
    const outputPath = 'plan/roadmap.md';
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
