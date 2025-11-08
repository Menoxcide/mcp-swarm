import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chokidar from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function startLiveUI(explorer: any) {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  io.on('connection', socket => {
    console.log('Client connected');

    const watcher = chokidar.watch(explorer.rootDir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.on('all', async (event, filePath) => {
      try {
        const files = await explorer.listFiles('/');
        socket.emit('files', files);
      } catch (error) {
        console.error('Error listing files:', error);
      }
    });

    socket.on('disconnect', () => {
      watcher.close();
      console.log('Client disconnected');
    });
  });

  server.listen(3000, () => {
    console.log('UI: http://localhost:3000');
  });

  return server;
}

// For standalone execution - run with: npx ts-node ui/server.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting UI server...');
  startLiveUI({
    rootDir: './sandbox',
    listFiles: async () => ['sample-file.txt']
  });
}
