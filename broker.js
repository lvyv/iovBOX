/**
 * @file 实现E515,E529等Websocket SVR，HTTP，Proxy代理
 *		 
 *	启动格式：node --inspect broker.js proto host port
 *
 *	文件名			:broker.js	
 *	编程者			:Awen
 *	日期			:2017.10.25	
 *	项目名			:车联网超级终端 Platform技术预研	
 *	操作系统		:Cross
 *
 *	编号----日期--------注释-------------------------------
 *	00		17.10.25	初期作成
 *	01		17.10.26	修改×××
 */
console.log('broker start..');
var url  = require("url"),
	fs=require("fs"),
	http=require("http"),
	path = require("path"),
	handlers = require("./protocol_handler.js");
	_ET_GLOBAL = require("./top.js");
var debugbrk = require("./iovdebug.js").getDebug('broker');
var __dirname = "./iovBOX";

function handle_request(req, res) {
    debugbrk('%s', url.parse(req.url).pathname);
    var pathname=__dirname + url.parse(req.url).pathname;
    if (pathname.charAt(pathname.length-1)==="/"){
        pathname+='broker.htm';
    }
    var exists = fs.existsSync(pathname);//,function(exists){
    if(exists){
		switch(path.extname(pathname)){
			case ".html":
			case ".htm":
				res.writeHead(200, {"Content-Type": "text/html"});
				break;
			case ".js":
				res.writeHead(200, {"Content-Type": "text/javascript"});
				break;
			case ".css":
				res.writeHead(200, {"Content-Type": "text/css"});
				break;
			case ".gif":
				res.writeHead(200, {"Content-Type": "image/gif"});
				break;
			case ".jpg":
				res.writeHead(200, {"Content-Type": "image/jpeg"});
				break;
			case ".png":
				res.writeHead(200, {"Content-Type": "image/png"});
				break;
			default:
				res.writeHead(200, {"Content-Type": "application/octet-stream"});
		}
		fs.readFile(pathname,function (err,data){
			res.end(data);
		});
	} else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.end("<h1>404 Not Found</h1>");
	};
}

// Loading socket.io
var server = http.createServer(handle_request);
var io = require('socket.io')(server);
server.listen(1123);


//WebSocket连接监听
io.on('connection', function (socket) {
	// 构造客户端对象	
	var client = {
		name:false,
		time:false,
		token:0,
		color:getColor(),
		l_sock:socket,
		w_sock:null
	};
	var local_port = socket.request.connection.localPort;
	//console.log(local_port);
	
	// 对ctrl channel事件的监听
	socket.on(_ET_GLOBAL.CTL_CHANNEL_IN, function(data) {
		// 发送反馈
		if(!handlers.ctl_handle(data, client, socket))
			socket.disconnect(true);	
		console.log(client);
	});
	//proxy Left channel event：proxy data forward
	socket.on(_ET_GLOBAL.PROXY_LEFT_IN,function(data) {
		console.log("broker.js:" + data);
		debugbrk("call proxy");
		if(!handlers.proxy_handle(data, client, socket))
			socket.disconnect(true);
	});
    //监听出退事件
    socket.on('disconnect', function () {  
      console.log(client.name + ' Disconnect.');
    });
});

var getColor=function(){
  var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
};

/**
 * 函数描述
 *
 * @param {Object} option 参数描述
 * @param {string} option.url option项描述
 * @param {string=} option.method option项描述，可选参数
 */
/* function proxy_process(proto, host, port) {
	var dgram = require('dgram');
	var client = dgram.createSocket('udp4');
	//udp发送数据
	
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
	
	client.send(buf, 0,buf.length, port, host, function (err, bytes) {
		//数据发送监听器
		if(err) {throw err;}
		});
	//监听message事件，接收数据
	client.on('message', function(msg){
		console.log('收到了UDP服务端消息:', msg.toString());
		client.close();
		});
}

 */