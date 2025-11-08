export default {
  name: 'market_researcher',
  async run(state: any, { explorer, model }: any) {
    console.log(`📊 Market Researcher analyzing: "${state.task}"`);

    // Customize prompt based on actual task
    let prompt = "Analyze CrewAI, Autogen, LangGraph. Output JSON: {pricing, stars, weaknesses}";
    if (state.task.toLowerCase().includes('big thing') || state.task.toLowerCase().includes('next')) {
      prompt = `Research the market opportunity for "${state.task}". Analyze competitors, market size, trends, and opportunities. Output comprehensive market analysis.`;
    }

    console.log(`🔍 Research prompt: "${prompt}"`);

    const response = await model.invoke([
      { role: 'user', content: prompt }
    ], this.name);

    // Write to /research/competitors.json or task-specific file
    const outputPath = state.task.toLowerCase().includes('big thing') ?
      'research/market_analysis.md' : 'research/competitors.json';

    console.log(`💾 Writing research to: ${outputPath}`);
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
