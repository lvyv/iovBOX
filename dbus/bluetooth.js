module.exports = bluetooth;

function bluetooth(dbus_app){
    var self = this;
    self.dbus = dbus_app;
    self.bluez_dbus_name = 'et.e52x.bluez';
    self.bluez_dbus_path= '/et/e52x/bluez';
    self.dbus_conf_json={
        path: self.bluez_dbus_path,
        destination: self.bluez_dbus_name,
        interface: self.bluez_dbus_name,
        member: 'enable',
        signature: 'b',
        body: [true],
        type: self.dbus.dbus.messageType.methodCall
    };

    self.ConnectStatus = {
        1:"CONNECT_STATUS_IDLE",
        2:"CONNECT_STATUS_FAST",
        3:"CONNECT_STATUS_SLOW",
        4:"CONNECT_STATUS_CONNECTED",
        5:"CONNECT_STATUS_CONNECTED_AND_BONDED",
        6:"CONNECT_STATUS_UNKNOWN"
    };

    self.WorkStatus = {
        1:"WORK_STATUS_NONE",
        2:"WORK_STATUS_RUNNING",
        3:"WORK_STATUS_STOP"
    };

    self.siganl_state = 'state';
    self.siganl_work = 'work';
    self.siganl_recv_data = 'dout';
    self.siganl_send_data = 'din';

    self.addMatchStatus = function (resolve, reject) {
        self.dbus.systemBus.addMatch("type='signal', member='" + self.siganl_state + "'", function(err, value) {
            try {
                if(err) {
                    reject(err);
                }
                else{
                    resolve(value);
                }
            } catch(error) {
                reject(error);
            }
        });
    };

    self.addMatchWork = function (resolve, reject) {
        self.dbus.systemBus.addMatch("type='signal', member='" + self.siganl_work + "'", function(err, value) {
            try {
                if(err) {
                    reject(err);
                }
                else{
                    resolve(value);
                }
            } catch(error) {
                reject(error);
            }
        });
    };

    self.addMatchData = function (resolve, reject) {
        self.dbus.systemBus.addMatch("type='signal', member='" + self.siganl_recv_data + "'", function(err, value) {
            try {
                if(err) {
                    reject(err);
                }
                else{
                    resolve(value);
                }
            } catch(error) {
                reject(error);
            }
        });
    };
    self.dbus.listener_fun_array.push(self.addMatchStatus);
    self.dbus.listener_fun_array.push(self.addMatchWork);
    self.dbus.listener_fun_array.push(self.addMatchData);
    self.proc = self.dbus.proc;
}

/**
 * 连接状态报告
 * bluetooth Status update
 * @param outputCallBack
 */
bluetooth.prototype.onConnectStatus = function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.bluez_dbus_path, self.bluez_dbus_name, self.siganl_state);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        // console.log('onConnectStatus');
        // console.log(messageBody);
        var event = {};
        var status = self.ConnectStatus[messageBody[0]];
        if (status){
            event.status = status;
        }
        else {
            event.status = messageBody[0];
        }
        return outputCallBack(event);
    });
};

/**
 * 工作状态报告
 * bluetooth Status update
 * @param outputCallBack
 */
bluetooth.prototype.onWorkStatus = function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.bluez_dbus_path, self.bluez_dbus_name, self.siganl_work);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        // console.log('onWorkStatus');
        // console.log(messageBody);
        var event = {};
        var status = self.WorkStatus[messageBody[0]];
        if (status){
            event.status = status;
        }
        else {
            event.status = messageBody[0];
        }
        return outputCallBack(event);
    });
};

/**
 * 消息数据报告
 * bluetooth message received
 * @param outputCallBack
 */
bluetooth.prototype.onMessage = function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.bluez_dbus_path, self.bluez_dbus_name, self.siganl_recv_data);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        // console.log(messageBody);
        var event = {
            message:messageBody
        };
        return outputCallBack(event);
    });
};

/**
 * 开启功能  enable  boolean:true
 * 关闭功能  enable  boolean:true
 * @param {boolean} enable
 * @param {function} outputCallBack
 */
bluetooth.prototype.setServerEnable = function(enable,outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json.member='enable';
        self.dbus_conf_json.signature = 'b';
        self.dbus_conf_json.body= [enable];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if (err){
                var event = {
                    code:-1,
                    message:'setServerEnable error!',
                    enable:enable,
                    result:err
                };
                outputCallBack(event);
            }
            else {
                var event = {
                    code:0,
                    message:'setServerEnable success!',
                    enable:enable,
                    result:res
                };
                if (res == false) {
                    event.code = -1;
                    event.message = "setServerEnable fail!"
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'setServerEnable exceptions!',
            enable:enable,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * 蓝牙发送消息数据
 * @param {string} message
 * @param outputCallBack
 */
bluetooth.prototype.sendMessage = function(message,outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus.systemBus.sendSignal(self.bluez_dbus_path, self.bluez_dbus_name, self.siganl_send_data, 's', [message]);

        var event = {
            code:0,
            message:'sendMessage success!'
        };
        outputCallBack(event);
    }).catch(function(res){
        var event = {
            code:-1,
            message:'sendMessage exceptions!',
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * 调试日志等级
 * @param {number} level 1 ~ 7
 * @param {function} outputCallBack
 */
bluetooth.prototype.setDebugLevel = function (level, outputCallBack)
{
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'debug_level';
        self.dbus_conf_json['signature'] = 'u';
        self.dbus_conf_json['body']= [level];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set debug level error!',
                    level:level,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'set debug level success!',
                    level:level,
                    result:res
                };
                if (res == false){
                    event.code = -1;
                    event.message = 'set debug level fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set debug level exceptions!',
            level:level,
            result:res
        };
        outputCallBack(event);
    });
};
