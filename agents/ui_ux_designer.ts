export default {
  name: 'ui_ux_designer',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Generate React + Tailwind dashboard";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /ui/App.tsx
    const outputPath = 'ui/App.tsx';
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
