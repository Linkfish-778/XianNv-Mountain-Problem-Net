
import { IssueItem } from '../types';
import { INITIAL_ISSUES } from '../constants';

// 模拟数据库存储
let issuesDb: IssueItem[] = [...INITIAL_ISSUES];

export const IssueModel = {
  findAll: async () => issuesDb,
  
  findById: async (id: string) => issuesDb.find(i => i.id === id),
  
  create: async (item: IssueItem) => {
    issuesDb.push(item); // 核心：使用 push 确保新项在分类列表最后
    return item;
  },
  
  update: async (id: string, updates: Partial<IssueItem>) => {
    const index = issuesDb.findIndex(i => i.id === id);
    if (index !== -1) {
      issuesDb[index] = { ...issuesDb[index], ...updates };
      return issuesDb[index];
    }
    return null;
  },
  
  remove: async (id: string) => {
    const initialLength = issuesDb.length;
    issuesDb = issuesDb.filter(i => i.id !== id);
    return issuesDb.length < initialLength;
  }
};
