import cloudbase from "@cloudbase/js-sdk";

// 初始化 CloudBase
// 我们从 Vercel 的环境变量中读取环境 ID
const app = cloudbase.init({
  env: import.meta.env.VITE_TCB_ENV_ID,
});

// 获取数据库引用
const db = app.database();

// 导出数据库实例，供 api.ts 文件使用
export { db };
