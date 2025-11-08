export default {
  name: 'growth_hacker',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Write 5 X threads + HN post";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /growth/*.md
    await explorer.writeFile('growth/x-threads.md', response.content);
    await explorer.writeFile('growth/hn-post.md', response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
