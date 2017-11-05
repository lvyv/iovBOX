//jquery used.
$(function () {
	var __ctl_chanel_in = 'ctl_in';
	var __ctl_chanel_out = 'ctl_out';
	
	//var myName = false;
	var wssvr = $('#websocket_svr');
	var input = $('#input');
	var content = $('#content');
	var stat = $('#staus');
		
	var socket = io.connect(wssvr.val());
	//$('#status').text('"login":"lvyu"');
	//通过“回车”提交聊天信息
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
				socket.emit(__ctl_chanel_in, packet_obj);
				
				var p = '<p><span>' +'client'+'</span> @ '+ date + ' : '+ msg +'</p>';
				content.prepend(p);
			} catch(error) {
				console.log(error);
			}
		}
	});
	// 订阅svr_out事件
	socket.on(__ctl_chanel_out,function(json) { 
		var p = '<p><span style="color:'+json.color+';">server @ ' + json.time + '</span> '+json.token+'</p>';
        content.prepend(p);
	});			
	// 各种连接状态监听器
	socket.on('disconnect',function() { 
		console.log('The client has disconnected!'); 
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