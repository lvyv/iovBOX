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

var url  = require("url"),
	fs=require("fs"),
	http=require("http"),
	path = require("path"),
	ctl_handle = require("./protocol_handler.js");
	
var __dirname = "./iovBOX";
var __ctl_chanel_in = 'ctl_in';


var proto_ = process.argv[2];
var host_ = process.argv[3];
var port_ = parseInt(process.argv[4],10);

function handle_request(req, res) {
    var pathname=__dirname + url.parse(req.url).pathname;
    if (pathname.charAt(pathname.length-1)==="/"){
        pathname+='broker.htm';
    }
    fs.exists(pathname,function(exists){
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
        }
    }); 
}

function get_file_content(filepath) {
    return fs.readFileSync(filepath);
}

// Loading socket.io
var server = http.createServer(handle_request);
var io = require('socket.io').listen(server);
server.listen(3352);

//WebSocket连接监听
io.on('connection', function (socket) {
	// 构造客户端对象	
	var client = {
		name:false,
		time:false,
		token:0,
		color:getColor()
	};
	
	// 对stdin事件的监听
	socket.on(__ctl_chanel_in,function(data) {
		if((!client.name)&&(client.token===0)){
			client.name = data.login;
			client.token = data.time;//用客户的时间戳为token
		}
		client.time = data.time;
		console.log(client);
		// 发送反馈
		if(!ctl_handle(data, client, socket))
			socket.disconnect(true);;		
	});
	// 对message事件的监听
	socket.on('message', function(msg){
		var obj = {time:getTime(),color:client.color};

		// 判断是不是第一次连接，以第一条消息作为用户名
		if(!client.name){
			client.name = msg;
			obj['text']=client.name;
			obj['author']='System';
			obj['type']='welcome';
			console.log(client.name + ' login');
	
			//返回欢迎语
			socket.emit('system',obj);
			//广播新用户已登陆
			socket.broadcast.emit('system',obj);
		}else{

			//如果不是第一次的连接，正常的聊天消息
			obj['text']=msg;
			obj['author']=client.name;      
			obj['type']='message';
			console.log(client.name + ' say: ' + msg);

			// 返回消息（可以省略）
			socket.emit('message',obj);
			// 广播向其他用户发消息
			socket.broadcast.emit('message',obj);
		}
	});

    //监听出退事件
    socket.on('disconnect', function () {  
      var obj = {
        time:getTime(),
        color:client.color,
        author:'System',
        text:client.name,
        type:'disconnect'
      };

      // 广播用户已退出
      //socket.broadcast.emit('system',obj);
      console.log(client.name + ' Disconnect.');
    });
  
});

var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

var getColor=function(){
  var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}

/**
 * 函数描述
 *
 * @param {Object} option 参数描述
 * @param {string} option.url option项描述
 * @param {string=} option.method option项描述，可选参数
 */
function proxy_process(proto, host, port) {
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
		})
}

