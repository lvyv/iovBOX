var dbus_app = require('../dbus/dbus_app.js');
var ledlib=require('../dbus/led.js');
var dbus_obj = new dbus_app();
var led = new ledlib(dbus_obj);

dbus_obj.register_app_name();

led.setDebugLevel(6,function(res){
    console.log("set debug level "+ JSON.stringify(res));
});

//color "black blue cyan orange red white pink green"
led.setColor(1,"black",function(res) {
    console.log("set color "+ JSON.stringify(res));
});

led.setColor(2,"black",function(res) {
    console.log("set color "+ JSON.stringify(res));
});

led.setColor(3,"black",function(res) {
    console.log("set color "+ JSON.stringify(res));
});

led.setColor(4,"black",function(res) {
    console.log("set color "+ JSON.stringify(res));
});

led.setColor(0,"red",function(res) {
    console.log("set color "+ JSON.stringify(res));
});
