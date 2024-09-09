// deno
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";

interface userInfo {
	username : string
	password : string
}

interface IUser {
	id : number,
	username : string,
	password : string,
	avatar : string,
	email : string,
	phone : string,
	gender : number,
	birthDate : string,
	signature : string,
	createdTime : string,
	updateDate : string,
	token : string
}

//连接数据库
const client = await new Client().connect({
	hostname: "127.0.0.1",
	username: "root",
	db: "shuaitok",
	password: "",
});

const handler = async (request : Request) : Promise<Response> => {
	const { method, url } = request;
	const pathname = new URL(url).pathname; // 获取请求路径

	// 根据路径和请求方法来处理不同的接口
	if (pathname.startsWith("/apis/user")) {
		return handleUserRoute(request, method);
	} else if (pathname.startsWith("/apis/admin")) {
		return handleAdminRoute(request, method);
	} else {
		return new Response("Not Found", {
			status: 404,
			headers: { "Content-Type": "text/plain" },
		});
	}
};

// 处理 /apis/user 路径
const handleUserRoute = async (request : Request, method : string) : Promise<Response> => {
	switch (method) {
		// case "GET":
		//   // GET 请求中解析 URL 参数，而不是请求体
		//   const url = new URL(request.url);
		//   const username = url.searchParams.get("username") || "guest";
		//   const password = url.searchParams.get("password") || "";
		//   console.log(`${username} ::: ${password}`);
		//   return new Response("User GET request received!", {
		//     status: 200,
		//     headers: { "Content-Type": "text/plain" },
		//   });

		case "POST":
			// POST 请求通常带有 JSON 数据
			const postData = await request.json() as userInfo; // 解析请求体中的 JSON 数据
			const user_username = postData.username;
			const user_password = postData.password;
			const { rows: users } = await client.execute(`SELECT * FROM users WHERE username = ?`, [user_username])
			const getUserInfo : IUser = users[0] as IUser
			//TODO 应该使用哈希盐值加密密码，外加前后端双重校验
			let resJSON : { 
				code : number; 
				message : string; 
				result : { 
					userId : number; 
					username : string; 
					userAvatar : string; 
					userEmail : string; 
					userPhone : string; 
					userGender : number; 
					userBirthDate : string; 
					userSignature : string; 
					userCreatedTime : string; 
					userUpateTime : string; 
					userToken : string; 
					} | {}; }
			if (getUserInfo.password === user_password) {
				resJSON = {
					code: 200,
					message: '登录成功',
					result: {
						// userId: getUserInfo.id,
						// username: getUserInfo.username,
						// userAvatar: getUserInfo.avatar,
						// userEmail: getUserInfo.email,
						// userPhone: getUserInfo.phone,
						// userGender: getUserInfo.gender,
						// userBirthDate: getUserInfo.birthDate,
						// userSignature: getUserInfo.signature,
						// userCreatedTime: getUserInfo.createdTime,
						// userUpateTime: getUserInfo.updateDate,
						// userToken: getUserInfo.token
						userId: 123,
						username: 'sksk',
						userAvatar: 'sksk',
						userEmail: 'sksk',
						userPhone: 'sksk',
						userGender: 0,
						userBirthDate: 'sksk',
						userSignature: 'sksk',
						userCreatedTime: 'sksk',
						userUpateTime: 'sksk',
						userToken: 'sksk'
					}
				}
			} else {
				resJSON = {
					code: 403,
					message: '登录失败，检查用户名或密码',
					result: {}
				}
			}

			return new Response(JSON.stringify(resJSON), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});

		default:
			return new Response("Method not supported for /apis/user", {
				status: 405,
				headers: { "Content-Type": "text/plain" },
			});
	}
};


// 处理 /apis/admin 路径
const handleAdminRoute = async (request : Request, method : string) : Promise<Response> => {
	switch (method) {
		case "GET":
			return new Response("Admin GET request received!", {
				status: 200,
				headers: { "Content-Type": "text/plain" },
			});

		case "POST":
			const adminData = await request.json();
			return new Response(`Admin POST request received with data: ${JSON.stringify(adminData)}`, {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});

		default:
			return new Response("Method not supported for /apis/admin", {
				status: 405,
				headers: { "Content-Type": "text/plain" },
			});
	}
};

// 启动服务器
console.log("HTTP webserver running. Access it at: http://localhost:8000/");
await serve(handler, { port: 8000 });
