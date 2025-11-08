import simpleGit from 'simple-git';

export default {
  name: 'auto_commit',
  trigger: 'on_file_write',
  async execute(state: any, context: any) {
    const git = simpleGit();
    try {
      await git.add('.');
      await git.commit(`Auto: ${new Date().toISOString()}`);
      console.log('Auto-committed changes');
    } catch (error) {
      console.error('Auto-commit failed:', error);
    }
  }
};
