export default {
  name: 'hn_poster',
  trigger: 'on_file_write:/growth/hn-post.md',
  async execute(state: any, context: any) {
    // This would integrate with HN API or MCP
    console.log('HN post ready - would submit to Hacker News');
    // For now, just log the action
  }
};
