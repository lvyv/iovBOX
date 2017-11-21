//jquery used.
$(function () {
	var wssvr = $('#websocket_svr');
	var wssvr2 = $('#websocket_svr_proxy');
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
	//十六进制字符串转字节数组
	function HexStr2Bytes(str) {
		var hexBytes = new Array();
		var hexA = str.split(" ");
		for(var i=0; i<hexA.length; i++) {
			var v = parseInt(hexA[i],16);
			hexBytes.push(v);
		}
		return hexBytes;
	}
	function Str2Bytes(str) {
		var pos = 0;
		var len = str.length;
		if(len %2 != 0) {
		   return null; 
		}
		len /= 2;
		var hexA = new Array();
		for(var i=0; i<len; i++) {
		   var s = str.substr(pos, 2);
		   var v = parseInt(s, 16);
		   hexA.push(v);
		   pos += 2;
		}
		return hexA;
	}
	//字节数组转十六进制字符串
	function Bytes2Str(arr) {
		var str = "";
		for(var i=0; i<arr.length; i++) {
		   var tmp = arr[i].toString(16);
		   if(tmp.length == 1) {
			   tmp = "0" + tmp;
		   }
		   tmp = tmp + " ";
		   str += tmp;
		}
		return str;
	}
	var socket = io.connect(wssvr.val());
	var socketProxy = io.connect(wssvr2.val());

	//通过“回车”提交控制信道命令
	input.keydown(function(e) {
		if (e.keyCode === 13) {
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
	//testJS
	btnTestJS.click(function() {
		var hex = proxyData.val();
		var typedArray = Str2Bytes(hex);
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
		var hexA = HexStr2Bytes(pData);
		socketProxy.emit(_ET_GLOBAL.PROXY_LEFT_IN, hexA);
	});
	// 订阅svr_out事件
	socket.on(_ET_GLOBAL.CTL_CHANNEL_OUT, function(json) { 
		var p = '<p><span style="color:'+json.color+';">server @ ' + json.time + '</span> '+json.token+'</p>';
        content.prepend(p);
	});			
	//proxy Left channel event：proxy data reply
	socketProxy.on(_ET_GLOBAL.PROXY_LEFT_OUT, function(data) {
		$('#proxyReply').val(String.fromCharCode.apply(null, new Uint8Array(data)));
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
