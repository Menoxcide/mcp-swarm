// Template for plugins
export default {
  name: 'example_plugin',
  trigger: 'on_file_write', // or 'on_phase_change:phase_name'
  async execute(state: any, context: any) {
    // Plugin execution logic
    console.log(`Plugin ${this.name} triggered:`, state);
  }
};
