#!/usr/bin/env node

var dbus_app = require('../dbus/dbus_app.js');
var gpslib = require('../dbus/gps.js');
var dbus_obj = new dbus_app();
var gps = new gpslib(dbus_obj);

dbus_obj.register_app_name();


gps.onReportNMEA(function(res) {
	console.log('report nmea :'+ (res));
});

gps.onReportData(function (res) {
	console.log('report data :'+ JSON.stringify(res));
});

gps.setReportEnable(1, function(res) {
	console.log('setReportEnable: ' + JSON.stringify(res));
});

gps.setReportType(2, function(res){
	console.log('set report ' +JSON.stringify(res));
});

gps.setDebugLevel(7, function(res){
	console.log('set debug level :' +JSON.stringify(res));
});