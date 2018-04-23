var led= require('../dbus/led.js');

led.setDebugLevel(6,(res)=>{
    console.log("set debug level "+ res);
});

led.setColor((res) => {

});
