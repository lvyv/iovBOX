#!/usr/bin/env node

var dbus_app = require('../dbus/dbus_app.js');
var imulib=require('../dbus/IMU.js');
var dbus_obj = new dbus_app();
var imu = new imulib(dbus_obj);

dbus_obj.register_app_name();

imu.onIMUReport( function(res) {
	console.log("imu report:" + JSON.stringify(res));
});

imu.setSample(5,function(res){
	console.log("set imu samples" +JSON.stringify(res));
});

imu.setDebugLevel(6,function(res){
	console.log("set debug level" +JSON.stringify(res));
});

imu.setSwitch(0, function(res){
    console.log("set switch on for "+ JSON.stringify(res));
});



