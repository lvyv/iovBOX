#!/usr/bin/env node

var dbus_app = require('../dbus/dbus_app.js');
var powerlib=require('../dbus/power.js');
var dbus_obj = new dbus_app();
var power = new powerlib(dbus_obj);

dbus_obj.register_app_name();

power.getData(3, function(res){
	console.log("get data "+JSON.stringify(res));
});

power.getWarnInfo(6, function(res){
    console.log("get warn info"+JSON.stringify(res));

});

power.setDebugLevel(6,function(res){
	console.log("set debug level " + JSON.stringify(res));
});

power.setData(1, 5, function(res){
    console.log("set data  "+ JSON.stringify(res));
});


power.getData(1,function(res){
	console.log("get data "+JSON.stringify(res));
})