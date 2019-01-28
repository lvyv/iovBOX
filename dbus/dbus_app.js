var dbus_native = require('dbus-native');

module.exports = dbus_app;

/**
 * 创建dbus应用服务对象，默认服务名称 'et.e52x.main'
 * 服务名称在 '/etc/dbus-1/system.d/' 目录添加
 * 添加方法 参考et.e52x.main.conf，确保配置文件中的名称与文件名保持一致
 * 服务名称添加完成，重启（reboot）系统生效
 *
 * @param service_name
 */
function dbus_app(service_name){
    var self = this;
    self.systemBus = dbus_native.systemBus();
    self.serviceName = service_name || 'et.e52x.main';
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
        }else if (retCode != undefined){
            self.reject("dbus app register fail! code = " + retCode);
        }
        else {
            self.reject(e);
        }
    });
};
