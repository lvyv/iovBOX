var gps = require('../dbus/gps.js');

gps.onReport((res)=>{
	console.log(res.toString());
})

gps.setReportType(1,(res)=>{
	console.log(`set report type ${res}`);
})

gps.setDebugLevel(1,(res)=>{
	console.log(`set debug level ${res}`);
})