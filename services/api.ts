import { db } from './supabaseClient';
import { IssueItem } from '../types';

// CloudBase 返回的数据和前端类型可能需要适配
// 我们假设 CloudBase 直接返回的字段名和结构与 IssueItem 兼容
// 但 id 通常是 _id，需要转换
const transformIssue = (issue: any): IssueItem => ({
  ...issue,
  id: issue._id, // 将 CloudBase 的 _id 映射到 id
  lastUpdated: new Date(issue.lastUpdated || Date.now()).toISOString().split('T')[0]
});

const issuesCollection = db.collection('issues');

export const api = {
  getIssues: async (): Promise<IssueItem[]> => {
    // 使用 TCB 的 get() 方法获取数据
    const res = await issuesCollection.limit(1000).get();
    // TCB 的数据在 res.data 中
    return res.data.map(transformIssue);
  },

  createIssue: async (issue: Omit<IssueItem, 'id' | 'lastUpdated'>): Promise<any> => {
    // 使用 TCB 的 add() 方法
    return await issuesCollection.add(issue);
  },

  updateIssue: async (id: string, updates: Partial<IssueItem>): Promise<any> => {
    // 使用 TCB 的 doc().update() 方法
    // 注意：TCB 使用文档的 _id 来定位
    return await issuesCollection.doc(id).update(updates);
  },

  deleteIssue: async (id: string): Promise<any> => {
    // 使用 TCB 的 doc().remove() 方法
    return await issuesCollection.doc(id).remove();
  }
};

export { transformIssue };
