export default {
  name: 'benchmark',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Run 5 trials, measure speed";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /perf/report.json
    const outputPath = 'perf/report.json';
    await explorer.writeFile(outputPath, JSON.stringify({
      trials: 5,
      results: response.content,
      timestamp: new Date().toISOString()
    }, null, 2));

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
