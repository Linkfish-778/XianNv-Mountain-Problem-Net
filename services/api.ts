import { db } from './supabaseClient'; // 文件名没变，但内容已经指向 TCB
import { IssueItem, IssueCategory } from '../types';

// 腾讯云数据库的集合引用
const issuesCollection = db.collection('issues');

// 数据转换函数：将从腾讯云获取的文档格式，转换为我们前端使用的 IssueItem 格式
// 主要区别在于，腾讯云的文档 ID 字段名为 `_id`
export const transformIssue = (tcbDoc: any): IssueItem => {
  return {
    id: tcbDoc._id, // 字段映射
    category: tcbDoc.category,
    description: tcbDoc.description,
    impact: tcbDoc.impact,
    status: tcbDoc.status,
    remarks: tcbDoc.remarks,
  };
};

export const api = {
  // 获取所有问题
  getIssues: async (): Promise<IssueItem[]> => {
    const result = await issuesCollection.limit(1000).get();
    return result.data.map(transformIssue);
  },

  // 创建一个新问题
  createIssue: async (issueData: Omit<IssueItem, 'id'>) => {
    return await issuesCollection.add(issueData);
  },

  // 更新一个问题
  updateIssue: async (id: string, updates: Partial<IssueItem>) => {
    // 在腾讯云中，不能更新 _id 字段，所以我们先从更新数据中删除它
    const dataToUpdate = { ...updates };
    delete (dataToUpdate as any).id; 
    
    return await issuesCollection.doc(id).update(dataToUpdate);
  },

  // 删除一个问题
  deleteIssue: async (id: string) => {
    return await issuesCollection.doc(id).remove();
  }
};
