export default {
  name: 'qa_tester',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Fuzz MCPs, test sandbox escape";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /test/report.md
    const outputPath = 'test/report.md';
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
