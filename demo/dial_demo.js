var dial=require('../dbus/dial.js');

dial.getInfo((res)=>{
	console.log("get info"+res);
});

dial.onSignalChange((res)=>{
	console.log("signal chaneged for "+res+"!");
});

dial.onStateChange((res)=>{
    console.log("state chaneged for "+res+"!");
});

dial.onSimStateChange(1,(res)=>{
     console.log("sim state chaneged for "+res+"!");
});

dial.sendMessage('13829983898', 'give me some money!', (res)=>
{
    console.log("send info out for "+res+"!");
});

dial.getList((res)=>{
    console.log("get list"+res);
});

dial.delMessage(0, 0, (res)=>{
    console.log("del msg 0,0"+res);
});