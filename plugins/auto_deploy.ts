import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
  name: 'auto_deploy',
  trigger: 'on_phase_change:launch',
  async execute(state: any, context: any) {
    try {
      const { stdout, stderr } = await execAsync('fly deploy --local-only');
      console.log('Auto-deployed:', stdout);
      if (stderr) console.error('Deploy stderr:', stderr);
    } catch (error) {
      console.error('Auto-deploy failed:', error);
    }
  }
};
