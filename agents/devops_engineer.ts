export default {
  name: 'devops_engineer',
  async run(state: any, { explorer, model }: any) {
    const prompt = "Write Dockerfile, fly.toml, GitHub Actions";
    const response = await model.invoke([
      { role: 'user', content: prompt }
    ]);

    // Write to /deploy/*
    await explorer.writeFile('deploy/Dockerfile', `FROM node:18\n${response.content}`);
    await explorer.writeFile('deploy/fly.toml', response.content);
    await explorer.writeFile('deploy/.github/workflows/deploy.yml', response.content);

    return {
      results: {
        ...state.results,
        [this.name]: response.content
      }
    };
  }
};
