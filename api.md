# 仙女山问题治理协同系统 API 接口文档 (v1.0)

本文件定义了前端协同系统与后端服务之间的数据交互协议。

## 1. 基础信息
- **Base URL**: `/api`
- **内容类型**: `application/json`
- **认证方式**: 无（当前开发环境，生产环境建议增加 Bearer Token）

---

## 2. 数据模型

### 2.1 IssueCategory (问题分类)
| 枚举值 | 描述 |
| :--- | :--- |
| `交通与基础设施` | 道路、通信、水电等基础设施问题 |
| `旅游产品与业态` | 景区项目、文创、季节性产品 |
| `三农融合与民生` | 农业发展、村民生活、社会保障 |
| `生态保护与治理` | 环境卫生、植被保护、资源管理 |
| `运营管理与服务` | 投诉处理、应急响应、服务质量 |
| `其他相关问题` | 以上未涵盖的问题 |

### 2.2 IssueStatus (处理状态)
- `待解决`
- `处理中`
- `已解决`
- `待补充`

### 2.3 IssueItem (数据对象)
```json
{
  "id": "string",
  "category": "IssueCategory",
  "description": "string",
  "impact": "string (optional)",
  "status": "IssueStatus",
  "remarks": "string (optional)",
  "lastUpdated": "string (YYYY-MM-DD)"
}
```

---

## 3. 接口列表

### 3.1 获取所有记录
获取系统中存储的所有治理项列表。

- **URL**: `/issues`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "1",
      "category": "交通与基础设施",
      "description": "冰雪季交通拥堵严重",
      "status": "待解决",
      "lastUpdated": "2026-01-15"
    }
  ]
  ```

### 3.2 新增记录
在系统中创建一条新记录，新记录会自动追加至对应分类的末尾。

- **URL**: `/issues`
- **Method**: `POST`
- **Body**: `IssueItem` (完整对象)
- **Response (201 Created)**: 返回创建成功的 `IssueItem` 对象。

### 3.3 部分更新记录
根据 ID 修改特定字段（描述、状态、备注等）。

- **URL**: `/issues/:id`
- **Method**: `PATCH`
- **Body**: `Partial<IssueItem>` (仅包含需要修改的字段)
  ```json
  {
    "status": "处理中",
    "remarks": "已增派人员现场疏导"
  }
  ```
- **Response (200 OK)**: 返回更新后的完整 `IssueItem` 对象。
- **Errors**: `404 Not Found` (ID 不存在)。

### 3.4 删除记录
永久移除特定 ID 的记录。

- **URL**: `/issues/:id`
- **Method**: `DELETE`
- **Response (204 No Content)**: 删除成功。
- **Errors**: `404 Not Found` (ID 不存在)。

---

## 4. 状态码规范
- `200 OK`: 请求成功。
- `201 Created`: 资源创建成功。
- `204 No Content`: 操作成功（无返回正文，如删除）。
- `400 Bad Request`: 参数格式不正确。
- `404 Not Found`: 请求的资源 ID 不存在。
- `500 Internal Server Error`: 后端逻辑执行异常。

---

## 5. 前端调用示例 (TypeScript)
```typescript
// 更新状态示例
const updateStatus = async (id: string, newStatus: IssueStatus) => {
  const response = await fetch(`/api/issues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  return await response.json();
};
```
