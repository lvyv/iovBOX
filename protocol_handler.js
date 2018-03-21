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
var debugptlh = require("./iovdebug.js").getDebug('protocol');
var _udp_cli = _dgram.createSocket('udp4');
//var _tcp_cli = net.connect(_ET_GLOBAL.PROXY_PORT, _ET_GLOBAL.PROXY_HOST);
//监听message事件，接收数据(这个地方有bug)
_udp_cli.on('message', function(msg, rinfo) {
	//socket.emit(_ET_GLOBAL.PROXY_LEFT_OUT, msg);
	var hexS = "00 04 00 01";
	var hexA = _ET_GLOBAL.HexStr2Bytes(hexS);
	var buf = Buffer.from(hexA);
	_udp_cli.send(buf, 0, buf.length, rinfo.port,rinfo.address,
		function(err, bytes) {
			//数据发送监听器
			if(err) {throw err;}
		});
	console.log('收到了UDP服务端消息:', msg.toString(),rinfo.address,rinfo.port);
});


const proto_handler_ = {
	"login":login,
	"host":host,
	"port":port,
	"cmd":ctrl_cmd
 };

 			//监听message事件，接收数据
_udp_cli.on('message', function(msg) {
				socket.emit(_ET_GLOBAL.PROXY_LEFT_OUT, msg);
				console.log('收到了UDP服务端消息:', msg.toString());
	});

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
	debugptlh(pkg.host);
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
	debugptlh(pkg.port);
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

		var buf = Buffer.from(pkg);
		debugptlh('proxy:%o', buf);
		_udp_cli.send(buf, 0, buf.length, _ET_GLOBAL.PROXY_PORT, _ET_GLOBAL.PROXY_HOST,
		  function(err, bytes) {
				//数据发送监听器
				if(err) {throw err;}
			});

		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports.proxy_handle = proxy_handle;