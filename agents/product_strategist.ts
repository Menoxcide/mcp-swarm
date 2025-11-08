export default {
  name: 'product_strategist',
  async run(state: any, { explorer, model }: any) {
    console.log(`🎯 Product Strategist planning for: "${state.task}"`);

    // Customize prompt based on actual task
    let prompt = "Define 3 MVP features + paid upgrade path";
    if (state.task.toLowerCase().includes('big thing') || state.task.toLowerCase().includes('next')) {
      prompt = `Create a product strategy and roadmap for "${state.task}". Define MVP features, monetization model, target market, and go-to-market strategy.`;
    }

    console.log(`📋 Strategy prompt: "${prompt}"`);

    const response = await model.invoke([
      { role: 'user', content: prompt }
    ], this.name);

    // Write to /plan/roadmap.md
    const outputPath = 'plan/roadmap.md';
    console.log(`📝 Writing strategy to: ${outputPath}`);
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
