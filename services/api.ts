import { supabase } from './supabaseClient';
import { IssueItem } from '../types';

// Supabase 返回的数据通常需要一些转换以匹配我们的前端类型
type IssueFromSupabase = Omit<IssueItem, 'id'> & { id: number; created_at: string };

const transformIssue = (issue: IssueFromSupabase): IssueItem => ({
    ...issue,
    id: issue.id.toString(), // 将 number 类型的 id 转换为 string
    lastUpdated: new Date(issue.created_at).toISOString().split('T')[0] // 简化日期格式
});

export const api = {
    getIssues: async (): Promise<IssueItem[]> => {
        const { data, error } = await supabase.from('issues').select('*');
        if (error) throw error;
        return data.map(transformIssue);
    },

    createIssue: async (issue: Omit<IssueItem, 'id' | 'lastUpdated'>): Promise<IssueItem> => {
        const { data, error } = await supabase.from('issues').insert(issue).select();
        if (error) throw error;
        return transformIssue(data[0]);
    },

    updateIssue: async (id: string, updates: Partial<IssueItem>): Promise<IssueItem> => {
        const { data, error } = await supabase.from('issues').update(updates).eq('id', id).select();
        if (error) throw error;
        return transformIssue(data[0]);
    },

    deleteIssue: async (id: string): Promise<void> => {
        const { error } = await supabase.from('issues').delete().eq('id', id);
        if (error) throw error;
    }
};