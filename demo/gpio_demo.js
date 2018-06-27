#!/usr/bin/env node

var dbus_app = require('dbus-js/dbus_app.js');
var gpiolib = require('dbus-js/gpio.js');
var dbus_obj = new dbus_app();
var gpio = new gpiolib(dbus_obj);

dbus_obj.register_app_name();

gpio.setDebugLevel(7,function(res){
    console.log('set debug level :' + JSON.stringify(res));
});

gpio.onInputChange(function(res) {
	console.log("singal change:" + JSON.stringify(res));
});

gpio.setLow(0,function(res){
	console.log("channel 0 output Low!" + JSON.stringify(res));
});

gpio.setHigh(0,function(res){
	console.log("channel 0 output high!"+JSON.stringify(res));
});

gpio.setLow(1,function(res){
	console.log("channel 1 output Low!" + JSON.stringify(res));
});

gpio.setHigh(1,function(res){
	console.log("channel 1 output high!" + JSON.stringify(res));
});

gpio.getCurrentIOState(function(res){
	console.log("get Current IO State" + JSON.stringify(res));
});

