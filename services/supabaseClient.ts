import cloudbase from "@cloudbase/js-sdk";

// 初始化 CloudBase
// 使用您提供的环境 ID
const app = cloudbase.init({
  env: "xiannv-7gjman30596fb7b0",
});

// 获取数据库引用
const db = app.database();

// 导出数据库实例，供 api.ts 文件使用
export { db };
