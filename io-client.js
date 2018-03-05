//jquery used.
$(function () {
	var wssvr = $('#websocket_svr');
	var input = $('#input');
	var stat = $('#staus');
	var proxyData = $('#proxyData');
	var proxyReply = $('#proxyReply');
	var content = $('#content');
	var btnProxy = $('#btnProxy');
	var btnProxyCmd = $('#btnProxyCmd');
	var btnTestJS = $('#testJS');
	var loginCmd = $('#login_cmd');
	var hostCmd = $('#host_cmd');
	var portCmd = $('#port_cmd');


	var socket = io.connect(); //wssvr.val()
    var uploader = new SocketIOFileUpload(socket);
	$('#siofu_input').val();

    uploader.listenOnInput(document.getElementById("siofu_input"));
    uploader.addEventListener("complete", function(data) {
		console.log(data.file.name);
		_ET_GLOBAL.UPLOAD_FILENAME = data.file.name;
		
		//$('#siofu_input').val(data.file.name);
	});

	
	//通过“回车”提交控制信道命令
	input.keydown(function(e) {
		if (e.keyCode === 13) {  //event.which == 13
			try {
				var date = new Date();
				var msg = $(this).val();
				if (!msg) return;
				$(this).val('');
				//if(!myName) myName = msg;
				var jsonStr = '{'+msg+',"token":0,"time":'+date.valueOf()+'}';
				var packet_obj=jQuery.parseJSON(jsonStr);
				socket.emit(_ET_GLOBAL.CTL_CHANNEL_IN, packet_obj);
				
				var p = '<p><span>' +'client'+'</span> @ '+ date + ' : '+ msg +'</p>';
				content.prepend(p);
			} catch(error) {
				console.log(error);
			}
		}	
	});
	//	
	hostCmd.click(function() {
		try {
			var packet_obj=jQuery.parseJSON('{"host":"192.168.75.130"}');
			socket.emit(_ET_GLOBAL.CTL_CHANNEL_IN, packet_obj);
		} catch(error) {
			console.log(error);
		}	
	});
	portCmd.click(function(){
		try {
			var packet_obj=jQuery.parseJSON('{"port":"10220"}');
			socket.emit(_ET_GLOBAL.CTL_CHANNEL_IN, packet_obj);
		} catch(error) {
			console.log(error);
		}
	});

	//代理启动和停止
	btnProxyCmd.click(function(){
		var cmd = document.getElementById("btnProxyCmd");
		if(cmd.innerText==='run_proxy') {
			try {
				var packet_obj=jQuery.parseJSON('{"cmd":"run_proxy"}');
				socket.emit(_ET_GLOBAL.CTL_CHANNEL_IN, packet_obj);
			} catch(error) {
				console.log(error);
			}
			cmd.innerText = 'stop_proxy';
		} else {
			try {
				var packet_obj=jQuery.parseJSON('{"cmd":"stop_proxy"}');
				socket.emit(_ET_GLOBAL.CTL_CHANNEL_IN, packet_obj);
			} catch(error) {
				console.log(error);
			}
			cmd.innerText = 'run_proxy';
		}
	});
	//代理数据发送
	btnProxy.click(function() {
		var pData = proxyData.val();
		var hexA = _ET_GLOBAL.HexStr2Bytes(pData);
		var buf = new Array(516);
		buf[0] = 0x0;
		buf[1] = 0x6;
		buf[2] = 0;
		buf[3] = 0;
		buf[4] = 0x2E;
		socket.emit(_ET_GLOBAL.PROXY_LEFT_IN, buf);
	});
	//proxy UDP confirm
	btnTestJS.click(function() {
		var hexS = "00 04 00 01";
		var hexA = _ET_GLOBAL.HexStr2Bytes(hexS);
		socket.emit(_ET_GLOBAL.PROXY_LEFT_IN, hexA);
	});

   $('#runProg').click(function() {
	   var strJs = '{"cmd":"run","fname":"' + _ET_GLOBAL.UPLOAD_FILENAME + '"}';
	   console.log(strJs);
	   socket.emit(_ET_GLOBAL.PROXY_COMMAND, strJs);
   });
   
   $('#terminateProg').click(function() {
	   var strJs = '{"cmd":"terminate","fname":"' + _ET_GLOBAL.UPLOAD_FILENAME + '"}';
	   console.log(strJs);
	   socket.emit(_ET_GLOBAL.PROXY_COMMAND, strJs);
   });


	// 订阅svr_out事件
	socket.on(_ET_GLOBAL.CTL_CHANNEL_OUT, function(json) { 
		var p = '<p><span style="color:'+json.color+';">server @ ' + json.time + '</span> '+json.token+'</p>';
        content.prepend(p);
	});			
	//proxy Left channel event：proxy data reply
	socket.on(_ET_GLOBAL.PROXY_LEFT_OUT, function(data) {
		str = _ET_GLOBAL.Bytes2HexStr(new Uint8Array(data));
		$('#proxyReply').val(str);
		var hexS = "00 04 00 01 00 01 02 03 04 05 06 07 08 09 0a 0b";
		var hexA = _ET_GLOBAL.HexStr2Bytes(hexS);
	});
	// 各种连接状态监听器
	socket.on('disconnect',function() { 
		$('#status').text('disconnect.');
	}); 
	
	socket.on('connect',function(data) { 
		$('#status').text('connect.');
	});	
	
	socket.on('reconnect',function(data) { 
		$('#status').text('reconnect.');
	});	
	
	socket.on('reconnecting',function(data) { 
		$('#status').text('reconnecting.');
	});	
	// 添加数据监听器
	socket.on('message',function(data) { 
		$('#status').text('message.');
	});
});
