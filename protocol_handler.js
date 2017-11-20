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


var _dgram = require('dgram');
var _net = require('net');
var	_ET_GLOBAL = require("./top.js");
var _udp_cli = _dgram.createSocket('udp4');
//var _tcp_cli = new _net.Socket();

const proto_handler_ = {
	"login":login,
	"host":host,
	"port":port,
	"cmd":ctrl_cmd
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
	if(client.token===0){
		client.token = pkg.time;//用客户的时间戳为token
	}
	let reply = {
		color:client.color,					
		time:date.toString(),
		token:client.token
	};
	client.time = pkg.time;	
	client.name = pkg.login;
	socket.emit(_ET_GLOBAL.CTL_CHANNEL_OUT,reply);
}

/**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 */
function host(pkg, client, socket) {
	_ET_GLOBAL.PROXY_HOST = pkg.host;
} 

/**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 */
function port(pkg, client, socket) {
	_ET_GLOBAL.PROXY_PORT = pkg.port;
} 

/**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 */
function ctrl_cmd(pkg, client, socket) {
	if(pkg.cmd=='run_proxy') 
	{
		;
	} else if(pkg.cmd ==='stop_proxy') 
	{
		;	
	} else 
	{
		;
	}
} 

/**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 * @return {boolean} client's new credential
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

module.exports.ctl_handle = ctl_handle;

/**
 * 函数描述
 *
 * @param {Object} pkg 参数描述
 * @param {Object} client 参数描述
 * @param {Object} socket 参数描述
 * @return {boolean} client's new credential
 */
var proxy_handle = function proxy_process(pkg, client, socket) {
	try {
		var cmd = "list .";
		var buf = new Buffer(10);
		buf[0]=0;
		buf[1]=6;
		buf[2]=0;
		buf[3]=0;
		buf[4]=cmd.charCodeAt(5);
		buf[5]=0;//cmd.charCodeAt(1);
		buf[6]=0;//cmd.charCodeAt(2);
		buf[7]=0;//cmd.charCodeAt(3);
		buf[8]=0;//cmd.charCodeAt(4);
		buf[9]=0;//cmd.charCodeAt(5);
		_udp_cli.send(buf, 0, buf.length, _ET_GLOBAL.PROXY_PORT, _ET_GLOBAL.PROXY_HOST,
		  function(err, bytes) {
				//数据发送监听器
				if(err) {throw err;}
			});
			//监听message事件，接收数据
		_udp_cli.on('message', function(msg) {
				socket.emit(_ET_GLOBAL.PROXY_LEFT_OUT, msg);
				console.log('收到了UDP服务端消息:', msg.toString());
			});
		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports.proxy_handle = proxy_handle;