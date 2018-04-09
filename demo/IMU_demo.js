var imu = require('./IMU.js');


imu.onIMUReport((res) =>{
	console.log("imu report:"+res);
});

imu.setSwitch(1, (res)=>{
    console.log("set switch on for "+ res);
});

/*
imu.setSample(1,(res)=>{
	console.log("set imu samples 1s!");
});

imu.setDebugLevel(6,(res)=>{
	console.log("set debug level to 6!");
});
*/

