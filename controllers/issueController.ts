
import { Request, Response } from 'express';
import { IssueModel } from '../models/issueModel';
import { broadcast } from '../server';

export const IssueController = {
  getIssues: async (req: Request, res: Response) => {
    try {
      const data = await IssueModel.findAll();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: '服务器内部错误' });
    }
  },

  createIssue: async (req: Request, res: Response) => {
    try {
      const newItem = await IssueModel.create(req.body);
      broadcast({ event: 'issue-created', data: newItem });
      res.status(201).json(newItem);
    } catch (err) {
      res.status(400).json({ message: '数据格式错误' });
    }
  },

  updateIssue: async (req: Request, res: Response) => {
    try {
      const updated = await IssueModel.update(req.params.id, req.body);
      if (updated) {
        broadcast({ event: 'issue-updated', data: updated });
        res.json(updated);
      } else {
        res.status(404).json({ message: '未找到该项' });
      }
    } catch (err) {
      res.status(500).json({ message: '更新失败' });
    }
  },

  deleteIssue: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await IssueModel.remove(id);
      if (success) {
        broadcast({ event: 'issue-deleted', data: { id } });
        res.status(204).send();
      } else {
        res.status(404).json({ message: '未找到该项' });
      }
    } catch (err) {
      res.status(500).json({ message: '删除失败' });
    }
  }
};
