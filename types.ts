
export enum IssueCategory {
  TRANSPORTATION = '交通与基础设施',
  TOURISM_PRODUCT = '旅游产品与业态',
  LIVELIHOOD = '三农融合与民生',
  ECOLOGY = '生态保护与治理',
  MANAGEMENT = '运营管理与服务',
  OTHERS = '其他相关问题'
}

export type IssueStatus = '待解决' | '处理中' | '已解决' | '待补充';

export interface IssueItem {
  id: string;
  category: IssueCategory;
  description: string;
  impact?: string;
  status: IssueStatus;
  remarks?: string;
  lastUpdated: string;
}
