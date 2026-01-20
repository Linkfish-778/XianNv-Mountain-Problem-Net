
// 注意：此代码演示 Express 路由结构
// import express from 'express';
// const router = express.Router();
import { IssueController } from '../controllers/issueController';

export const setupIssueRoutes = (app: any) => {
  app.get('/api/issues', IssueController.getIssues);
  app.post('/api/issues', IssueController.createIssue);
  app.patch('/api/issues/:id', IssueController.updateIssue);
  app.delete('/api/issues/:id', IssueController.deleteIssue);
};
