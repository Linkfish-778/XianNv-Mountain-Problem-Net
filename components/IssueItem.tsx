
import React from 'react';
import { IssueItem } from '../types';
import { STATUS_OPTIONS, STATUS_COLORS } from '../constants';
import { AutoSizeTextArea } from './AutoSizeTextArea';

interface ItemProps {
  issue: IssueItem;
  onUpdate: (id: string, updates: Partial<IssueItem>) => void;
  onDelete: (id: string) => void;
}

export const DesktopRow: React.FC<ItemProps> = ({ issue, onUpdate, onDelete }) => (
  <tr className="hover:bg-blue-50/10 transition-colors border-b border-slate-50 group">
    {/* 移除了 ID 单元格 */}
    <td className="px-8 py-6 align-top">
      <AutoSizeTextArea 
        value={issue.description} 
        onChange={(v) => onUpdate(issue.id, { description: v })} 
        placeholder="点击输入问题..." 
        className="bg-transparent border-transparent hover:border-slate-200"
      />
    </td>
    <td className="px-4 py-6 align-top">
      <AutoSizeTextArea 
        value={issue.impact || ''} 
        onChange={(v) => onUpdate(issue.id, { impact: v })} 
        placeholder="对游客/居民的影响..." 
        className="bg-transparent border-transparent text-slate-500 text-xs"
      />
    </td>
    <td className="px-4 py-6 text-center align-top">
      <select 
        className={`text-[11px] font-black px-4 py-2 rounded-full cursor-pointer shadow-sm transition-transform active:scale-95 border-none ${STATUS_COLORS[issue.status]}`}
        value={issue.status} 
        onChange={(e) => onUpdate(issue.id, { status: e.target.value as any })}
      >
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </td>
    <td className="px-4 py-6 align-top">
      <AutoSizeTextArea 
        className="bg-slate-50/50 border-dashed border-slate-200 text-xs" 
        value={issue.remarks || ''} 
        onChange={(v) => onUpdate(issue.id, { remarks: v })} 
        placeholder="记录解决进展..." 
      />
    </td>
    <td className="px-8 py-6 text-right align-top">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(issue.id);
        }}
        className="inline-flex items-center justify-center w-10 h-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        title="删除此记录"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </td>
  </tr>
);

export const MobileCard: React.FC<ItemProps> = ({ issue, onUpdate, onDelete }) => (
  <div className="p-6 flex flex-col gap-5 bg-white">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* 移除了 ID 标签 */}
        <select 
          className={`text-[10px] font-black px-3 py-1.5 rounded-full border-none shadow-sm ${STATUS_COLORS[issue.status]}`}
          value={issue.status} 
          onChange={(e) => onUpdate(issue.id, { status: e.target.value as any })}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <button 
        onClick={() => onDelete(issue.id)} 
        className="w-10 h-10 flex items-center justify-center text-red-300 bg-red-50 rounded-xl active:bg-red-100 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">问题描述</label>
        <AutoSizeTextArea 
          value={issue.description} 
          onChange={(v) => onUpdate(issue.id, { description: v })} 
          className="text-sm bg-slate-50 border-none rounded-2xl"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">影响</label>
          <AutoSizeTextArea 
            className="text-[11px] bg-slate-50 border-none rounded-xl" 
            value={issue.impact || ''} 
            onChange={(v) => onUpdate(issue.id, { impact: v })} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">进展</label>
          <AutoSizeTextArea 
            className="bg-blue-50/30 border-dashed text-[11px] rounded-xl" 
            value={issue.remarks || ''} 
            onChange={(v) => onUpdate(issue.id, { remarks: v })} 
          />
        </div>
      </div>
    </div>
    
    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
      <span className="text-[9px] text-slate-300 font-medium">LATEST UPDATE: {issue.lastUpdated}</span>
    </div>
  </div>
);
