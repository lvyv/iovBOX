var power= require('../dbus/power.js');

power.getData(3, (res)=>{
	console.log("get data "+res);
});
/*
power.getWarnInfo(6, (res)=>{
    console.log("get warn info"+res);

})*/
power.setDebugLevel(6,(res)=>{
	console.log("set debug level to 6!");
});


power.setData(1,5, (res)=>{
    console.log("set data [1,5] for "+ res);
});


power.getData(1,(res)=>{
	console.log("get data "+res);
})