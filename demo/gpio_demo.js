var gpio = require('./gpio.js');


gpio.onInputChange((res) =>{
	console.log("singal change:"+res);
});

gpio.setLow(0,(res)=>{
	console.log("channel 0 output Low!");
});

gpio.setHigh(0,(res)=>{
	console.log("channel 0 output high!");
});

gpio.setLow(1,(res)=>{
	console.log("channel 1 output Low!");
});

gpio.setHigh(1,(res)=>{
	console.log("channel 1 output high!");
});

gpio.getInput((res)=>{
	console.log(res);
});

