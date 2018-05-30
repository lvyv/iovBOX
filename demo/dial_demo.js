var dbus_app = require('../dbus/dbus_app.js');
var diallib=require('../dbus/dial.js');
var dbus_obj = new dbus_app();
var dial = new diallib(dbus_obj);

dbus_obj.register_app_name();

dial.onSignalChange(function(res){
	console.log("signal chaneged for "+(res)+"!");
});

dial.onStateChange(function(res){
    console.log("state chaneged for "+(res)+"!");
});

dial.onSimStateChange(function(res){
     console.log("sim state chaneged for "+(res)+"!");
});

dial.onNetworkChange(function(res){
    console.log("sim state chaneged for "+JSON.stringify(res)+"!");
});

dial.getInfo(function(res){
    console.log("get info "+JSON.stringify(res));
});

// dial.sendMessage('18611853975', 'give me some money!', function(res)
// {
//     console.log("send info out for "+JSON.stringify(res)+"!");
// });

dial.getMessageList(4,  function(res){
    console.log("get list "+JSON.stringify(res));
});

dial.deleteMessage(0, 1, function(res){
    console.log("del msg "+JSON.stringify(res));
});