/**
 * @file 实现控制信令的协议解析应答
 *		 
 *
 *	文件名			:protocol_handler.js	
 *	编程者			:Awen
 *	日期			:2017.11.5	
 *	项目名			:车联网超级终端 Platform技术预研	
 *	操作系统		:Cross
 *
 *	编号----日期--------注释-------------------------------
 *	00		17.10.25	初期作成
 *	01		17.10.26	修改×××
 */
 
 const __ctl_chanel_out = 'ctl_out';
 
 const proto_handler_ = {
	"login":login
 };
 
/**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 */
function login(pkg, client, socket) {
	let date = new Date();
	let reply = {
		color:client.color,					
		time:date.toString(),
		token:client.token
	};
	socket.emit(__ctl_chanel_out,reply);
}
 
 
 /**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 * @return {boolean} 返回值描述
 */
var ctl_handle = function control_process(pkg, client, socket) {
	try {
		let prop = Object.getOwnPropertyNames(pkg);
		proto_handler_[prop[0]](pkg, client, socket);
		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports = ctl_handle;