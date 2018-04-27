var gps = require('../dbus/gps.js');

gps.onReportNMEA((res)=>{
	console.log('report nmea :'+res.toString());
})

gps.onReportData((res)=>{
	console.log('report data :'+res.toString());
})

gps.setReportEnable(1,(res)=>{
	console.log(`set report enable! `);
})

gps.setReportType(2,(res)=>{
	console.log(`set report type ${res}`);
})

gps.setDebugLevel(1,(res)=>{
	console.log(`set debug level ${res}`);
})