import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

// 创建服务器并区分路径
serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/apis/user" && req.method === "POST") {
    // 处理 /apis/user 路径
    try {
      const body = await req.json();
      const username = body.username;

      if (username) {
        const randomString = generateRandomString(10);
        const responseMessage = randomString + username;

        return new Response(responseMessage, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      } else {
        return new Response("Username is required", { status: 400 });
      }
    } catch (error) {
      return new Response("Invalid request", { status: 400 });
    }

  } else if (url.pathname === "/apis/random" && req.method === "GET") {
    // 处理 /apis/random 路径
    const randomString = generateRandomString(10);
    return new Response(randomString, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });

  } else {
    // 处理其他路径
    return new Response("Not found", { status: 404 });
  }
});
