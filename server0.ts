import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

// 生成随机 10 位字符串的函数
function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 创建服务器并返回随机字符串
serve((req) => {
  const randomString = generateRandomString(10);
  return new Response(randomString, { status: 200 });
});
