
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { IssueItem, IssueCategory } from './types';
import { IssueService } from './services/api';
import { DesktopRow, MobileCard } from './components/IssueItem';

const App: React.FC = () => {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [activeTab, setActiveTab] = useState<IssueCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 初始化加载
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await IssueService.getAll();
      setIssues(data);
    } catch (e) {
      console.error("加载失败", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 更新逻辑
  const handleUpdate = useCallback(async (id: string, updates: Partial<IssueItem>) => {
    const lastUpdated = new Date().toLocaleDateString('zh-CN', { 
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
    const finalUpdates = { ...updates, lastUpdated };
    
    // 乐观更新 UI
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...finalUpdates } : i));
    
    // 后台同步
    try {
      await IssueService.update(id, finalUpdates);
    } catch (e) {
      console.error("同步失败", e);
      loadData(); // 失败则回滚
    }
  }, []);

  // 删除逻辑
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('此操作将永久删除该记录，确定继续吗？')) {
      setIssues(prev => prev.filter(i => i.id !== id));
      try {
        await IssueService.delete(id);
      } catch (e) {
        alert("删除失败，请检查网络");
        loadData();
      }
    }
  }, []);

  // 新增逻辑 - 确保追加到末尾
  const handleAdd = useCallback(async (category: IssueCategory) => {
    const nextId = (Math.max(0, ...issues.map(i => parseInt(i.id) || 0)) + 1).toString();
    const newItem: IssueItem = { 
      id: nextId, 
      category, 
      description: '', 
      impact: '', 
      status: '待补充', 
      remarks: '', 
      lastUpdated: new Date().toLocaleDateString('zh-CN') 
    };

    setIssues(prev => [...prev, newItem]); // 追加到末尾
    
    try {
      await IssueService.create(newItem);
    } catch (e) {
      console.error("新增失败", e);
      loadData();
    }
  }, [issues]);

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

      <nav className="sticky top-[108px] md:top-[73px] z-[90] bg-slate-50/95 backdrop-blur-md border-b border-slate-200 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('ALL')} 
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 border-2 ${activeTab === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'}`}
          >
            全部显示
          </button>
          {Object.values(IssueCategory).map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)} 
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 border-2 ${activeTab === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {Object.values(IssueCategory).filter(cat => activeTab === 'ALL' || activeTab === cat).map(cat => {
          const list = filtered.filter(i => i.category === cat);
          if (activeTab === 'ALL' && list.length === 0 && cat !== IssueCategory.OTHERS) return null;
          
          return (
            <section key={cat} className="bg-white rounded-[2rem] shadow-xl border border-slate-200/50 overflow-visible transition-shadow hover:shadow-2xl">
              <div className="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center sticky top-[180px] md:top-[145px] z-[80] rounded-t-[2rem]">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${cat === IssueCategory.OTHERS ? 'bg-slate-400' : 'bg-blue-600'}`} />
                  <h2 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">{cat}</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border border-slate-200">{list.length} 条记录</span>
                </div>
                <button 
                  onClick={() => handleAdd(cat)} 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 shadow-lg shadow-blue-200"
                >
                  + 新增
                </button>
              </div>

              <div className="hidden md:block">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <tr>
                      {/* 移除了 ID 列 */}
                      <th className="px-8 py-5 w-1/3">问题核心描述</th>
                      <th className="px-4 py-5 w-1/4">影响分析</th>
                      <th className="px-4 py-5 text-center w-40">状态</th>
                      <th className="px-4 py-5">进展/备注</th>
                      <th className="px-8 py-5 text-right w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {list.map(i => (
                      <DesktopRow 
                        key={i.id} 
                        issue={i} 
                        onUpdate={handleUpdate} 
                        onDelete={handleDelete} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col divide-y divide-slate-100">
                {list.map(i => (
                  <MobileCard 
                    key={i.id} 
                    issue={i} 
                    onUpdate={handleUpdate} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>

              {list.length === 0 && (
                <div className="py-20 text-center text-slate-300 font-medium">
                  该类别暂无异常记录
                </div>
              )}
            </section>
          );
        })}
      </main>

      <footer className="bg-slate-900 py-20 text-center mt-20">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.6em] mb-4">Wulong Fairy Mountain Governance System</p>
        <p className="text-slate-400 text-xs tracking-widest">© 2026 数据已接入云端治理平台</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
