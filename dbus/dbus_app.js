var dbus_native = require('dbus-native');
var Promise = require('promise');

module.exports = dbus_app;

function dbus_app(){
    var self = this;
    self.systemBus = dbus_native.systemBus();
    self.serviceName = 'et.e52x.main';
    self.proc = new Promise(function(resolve, reject) {
        console.log("init Promise done!!");
       self.resolve = resolve;
       self.reject = reject;
    });
    self.dbus = dbus_native;
    self.listener_fun_array = new Array();
}

dbus_app.prototype.register_app_name = function() {
    var self = this;
    self.systemBus.requestName(self.serviceName, 0x4, function(e, retCode) {
        // Return code 0x1 means we successfully had the name
        if(retCode === 1) {
            console.log("dbus app register success!");
            for (var i = 0; i < self.listener_fun_array.length; ++i){
                var fun = self.listener_fun_array[i];
                if((typeof fun === "function")){
                    fun(self.resolve, self.reject);
                }
            }
        }else{
            self.reject("dbus app register fail! code = " + retCode);
        }
    });
};
