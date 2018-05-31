#!/usr/bin/env node

var dbus_app = require('../dbus/dbus_app.js');
var ledlib=require('../dbus/led.js');
var dbus_obj = new dbus_app();
var led = new ledlib(dbus_obj);

dbus_obj.register_app_name();

//color "black blue cyan orange red white pink green"
var color_array = [
    "black",
    "blue",
    "cyan",
    "orange",
    "red",
    "white",
    "pink",
    "green"
];

function getColor(){
    var i = Math.round(Math.random() * color_array.length);
    return color_array[i];
}

led.setDebugLevel(6,function(res){
    console.log("set debug level "+ JSON.stringify(res));
});

setInterval(function () {
    var color = getColor();
    led.setColor(1,color,function(res) {
        console.log("set color "+ JSON.stringify(res));
    });
    color = getColor();
    led.setColor(2,color,function(res) {
        console.log("set color "+ JSON.stringify(res));
    });
    color = getColor();
    led.setColor(3,color,function(res) {
        console.log("set color "+ JSON.stringify(res));
    });
    color = getColor();
    led.setColor(4,color,function(res) {
        console.log("set color "+ JSON.stringify(res));
    });
    // color = getColor();
    // led.setColor(0,color,function(res) {
    //     console.log("set color "+ JSON.stringify(res));
    // });

}, 500);

