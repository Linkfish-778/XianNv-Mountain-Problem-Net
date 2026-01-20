
/**
 * 仙女山治理系统 - 后端服务入口 (Node.js 示例)
 * 运行方式: ts-node server.ts
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { setupIssueRoutes } from './routes/issueRoutes';

const app = express();
app.use(cors());
app.use(express.json());
setupIssueRoutes(app);

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', ws => {
    console.log('Client connected to WebSocket');
    ws.on('close', () => console.log('Client disconnected'));
});

export function broadcast(message: object) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

app.listen(3001, () => {
    console.log('HTTP server is running on port 3001');
    console.log('WebSocket server is running on port 3002');
});
