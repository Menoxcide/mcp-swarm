export default {
  name: 'system_architect',
  async run(state: any, { explorer, model }: any) {
    console.log(`🏗️ System Architect designing for: "${state.task}"`);

    // Customize prompt based on actual task
    let prompt = "Design zero-cost architecture with Fly.io free";
    if (state.task.toLowerCase().includes('big thing') || state.task.toLowerCase().includes('next')) {
      prompt = `Design a complete technical architecture for "${state.task}". Include frontend, backend, database, deployment, security, and scalability considerations.`;
    }

    console.log(`🔧 Architecture prompt: "${prompt}"`);

    const response = await model.invoke([
      { role: 'user', content: prompt }
    ], this.name);

    // Write to /arch/system.mmd
    const outputPath = 'arch/system.mmd';
    console.log(`📐 Writing architecture to: ${outputPath}`);
    await explorer.writeFile(outputPath, response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
