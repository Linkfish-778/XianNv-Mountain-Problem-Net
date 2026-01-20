import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { IssueItem, IssueCategory } from './types';
import { api, transformIssue } from './services/api';
import { supabase } from './services/supabaseClient';
import { DesktopRow, MobileCard } from './components/IssueItem';

const App: React.FC = () => {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [activeTab, setActiveTab] = useState<IssueCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getIssues().then(initialIssues => {
      setIssues(initialIssues);
      setLoading(false);
    }).catch(e => {
      console.error("加载失败", e);
      setLoading(false);
    });

    const subscription = supabase
      .channel('issues-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setIssues(prev => prev.some(issue => issue.id === payload.new.id.toString()) ? prev : [...prev, transformIssue(payload.new)]);
        } else if (payload.eventType === 'UPDATE') {
          setIssues(prev => prev.map(issue => issue.id === payload.new.id.toString() ? transformIssue(payload.new) : issue));
        } else if (payload.eventType === 'DELETE') {
          setIssues(prev => prev.filter(issue => issue.id !== payload.old.id.toString()));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // 更新逻辑
  const handleUpdate = useCallback(async (id: string, updates: Partial<IssueItem>) => {
    // UI update is handled by the real-time subscription
    try {
      await api.updateIssue(id, updates);
    } catch (e) {
      console.error("同步失败", e);
      alert('更新失败，请稍后重试');
    }
  }, []);

  // 删除逻辑
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('此操作将永久删除该记录，确定继续吗？')) {
      // UI update is handled by the real-time subscription
      try {
        await api.deleteIssue(id);
      } catch (e) {
        alert("删除失败，请检查网络");
      }
    }
  }, []);

  // 新增逻辑
  const handleAdd = useCallback(async (category: IssueCategory) => {
    const newItemData = { 
      category, 
      description: '', 
      impact: '', 
      status: '待补充', 
      remarks: '',
    };
    
    try {
      // The real-time subscription will handle the UI update
      await api.createIssue(newItemData);
    } catch (e) {
      console.error("新增失败", e);
      alert("创建新条目失败，请检查网络连接或稍后重试。");
    }
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return issues.filter(i => {
      const matchesTab = activeTab === 'ALL' || i.category === activeTab;
      const matchesSearch = i.description.toLowerCase().includes(term) || 
                           (i.remarks || '').toLowerCase().includes(term);
      return matchesTab && matchesSearch;
    });
  }, [issues, activeTab, searchTerm]);

  if (loading && issues.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm">初始化治理系统...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-[100] px-4 py-4 md:px-8 shadow-sm flex flex-col md:flex-row gap-4 md:justify-between items-center">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg">🏔️</span>
          仙女山问题治理协同
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="搜索问题或进展..." 
              className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
      </header>

      <
