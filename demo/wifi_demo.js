#!/usr/bin/env node

var dbus_app = require('../dbus/dbus_app.js');
var wifilib=require('../dbus/wifi.js');
var dbus_obj = new dbus_app();
var wifi = new wifilib(dbus_obj);

dbus_obj.register_app_name();

wifi.onWifiStatus(function (res) {
    console.log("on Wifi Status " + JSON.stringify(res));
});

wifi.setDebugLevel(7,function(res){
    console.log("set debug level " + JSON.stringify(res));
});

wifi.queryWifiInfo(function (res) {
    console.log("query Wifi Info " + JSON.stringify(res));
});

wifi.setModeAP({ssid:'APyangxianzhi',password:'123456789',hidden:false},function (res) {
    console.log("setModeAP " + JSON.stringify(res));
});

// wifi.setModeSTA({ap_name:'Xiaomi_9260',password:'hnytxywangjia'},function (res) {
//     console.log("setModeSTA " + JSON.stringify(res));
// });

// wifi.setModeAPSTA({ssid:'APyangxianzhi',password:'123456789',ap_name:'Xiaomi_9260',ap_password:'hnytxywangjia',hidden:false},function (res) {
//     console.log("setModeAPSTA " + JSON.stringify(res));
// });