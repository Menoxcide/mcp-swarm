export default {
  name: 'market_researcher',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Analyze CrewAI, Autogen, LangGraph. Output JSON: {pricing, stars, weaknesses}";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /research/competitors.json
    const outputPath = 'research/competitors.json';
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
