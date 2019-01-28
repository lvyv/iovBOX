#!/usr/bin/env node

var dbus_app = require('dbus-js/dbus_app.js');
var bluetoothlib=require('dbus-js/bluetooth.js');
var dbus_obj = new dbus_app();
var bluetooth = new bluetoothlib(dbus_obj);

dbus_obj.register_app_name();

bluetooth.setDebugLevel(7,function(res){
    console.log("set debug level " + JSON.stringify(res));
});

bluetooth.setServerEnable(true, function(res){
    console.log("setServerEnable " + JSON.stringify(res));
});

bluetooth.onConnectStatus(function(res){
    console.log("onConnectStatus " + JSON.stringify(res));
});

bluetooth.onWorkStatus(function(res){
    console.log("onWorkStatus " + JSON.stringify(res));
});

bluetooth.onMessage(function(res){
    console.log("onMessage " + JSON.stringify(res));
});

setInterval(function () {
    bluetooth.sendMessage('give me some money!', function (res) {
        console.log("sendMessage " + JSON.stringify(res));
    });

    bluetooth.sendMessage('给钱!', function (res) {
        console.log("sendMessage " + JSON.stringify(res));
    });
}, 5 * 1000);