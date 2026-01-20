
import { IssueItem, IssueCategory } from './types';

export const STATUS_OPTIONS: ('待解决' | '处理中' | '已解决' | '待补充')[] = ['待解决', '处理中', '已解决', '待补充'];

export const STATUS_COLORS: Record<string, string> = {
  '待解决': 'bg-red-100 text-red-800',
  '处理中': 'bg-yellow-100 text-yellow-800',
  '已解决': 'bg-green-100 text-green-800',
  '待补充': 'bg-gray-100 text-gray-800',
};

export const INITIAL_ISSUES: IssueItem[] = [
  { id: '1', category: IssueCategory.TRANSPORTATION, description: '冰雪季交通拥拥堵严重，武隆县城到山顶常堵1-2小时', impact: '游客体验下降，存在安全隐患', status: '待解决', remarks: '', lastUpdated: '2026-01-15' },
  { id: '2', category: IssueCategory.TRANSPORTATION, description: '仙南牧道徒步路线遭车辆碾压，草皮破坏严重', impact: '生态景观受损，步道管理缺失', status: '待解决', remarks: '', lastUpdated: '2026-01-15' },
  { id: '3', category: IssueCategory.TRANSPORTATION, description: '部分山区通信信号弱', impact: '影响游客体验与村民日常通信', status: '处理中', remarks: '联通信号尤为薄弱', lastUpdated: '2026-01-15' },
  { id: '4', category: IssueCategory.TRANSPORTATION, description: '公共交通收班较早（下午4:30）', impact: '限制晚归游客与村民出行', status: '待解决', remarks: '', lastUpdated: '2026-01-15' },
  { id: '5', category: IssueCategory.TOURISM_PRODUCT, description: '产品季节性强，春秋季产品单薄', impact: '资源利用率低，收入波动大', status: '待解决', remarks: '', lastUpdated: '2026-01-15' },
  { id: '6', category: IssueCategory.TOURISM_PRODUCT, description: '农文旅融合深度不足', impact: '缺乏特色文创转化', status: '待解决', remarks: '', lastUpdated: '2026-01-15' },
  { id: '12', category: IssueCategory.ECOLOGY, description: '高峰时段草甸踩踏、垃圾乱扔', impact: '游客容量管控不足', status: '处理中', remarks: '需增派巡逻志愿者', lastUpdated: '2026-01-15' },
  { id: '15', category: IssueCategory.MANAGEMENT, description: '极端天气应急响应不足', impact: '扫雪作业引发纠纷', status: '处理中', remarks: '需完善预警发布机制', lastUpdated: '2026-01-15' }
];
