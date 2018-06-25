module.exports = power;

function power(dbus_app) {
    var self = this;
    self.dbus = dbus_app;
    self.power_dbus_name = 'et.e52x.power';
    self.power_dbus_path= '/' + self.power_dbus_name.replace(/\./g, '/');
    self.signame ='warn_info';
    self.warninfo = {
        0:'MAIN_POWER_SLEEP',
        1:'MAIN_POWER_VLOW',
        2:'MAIN_POWER_OFF',
        3:'BACK_POWER_VLOW',
        4:'DEVICE_UNCOVER',
        5:'DEVICE_ACC_ON',
        32:'MAIN_POWER_NORMAL',
        33:'MAIN_POWER_VHIGH',
        34:'MAIN_POWER_ON',
        35:'BACK_POWER_VHIGH',
        36:'DEVICE_COVER',
        37:'DEVICE_ACC_OFF',
        64:'SD_CARD_REMOVE',
        65:'MOBILE_NET_WAKEUP'
     };



    self.dbus_conf_json={
        'path': '/et/e52x/power',
        'destination': 'et.e52x.power',
        'interface': 'et.e52x.power',
        'member': 'set_data',
        'signature': 'ii',
        'body': [0,2.5],
        'type': self.dbus.dbus.messageType.methodCall
    };
    self.addMatchWarnInfo= function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\''+ self.signame +'\'', function(err, value) {
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
    self.dbus.listener_fun_array.push(self.addMatchWarnInfo);
    self.proc = self.dbus.proc;
}


power.prototype.onWarnInfo = function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.power_dbus_path, self.power_dbus_name, self.signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        /**
         * messageBody
         * int32: tags index
         */
        var event = { warninfo : self.warninfo[messageBody[0]] };
        
        return outputCallBack(event);
    });

}


/**
 * get certain info about power manage. call back after success.
 * 0x00 tempreture;  0x01 main voltage; 0x02 back voltage;
 * 0x04 main voltage less; 0x20 work mode; 0x21 acc state;
 * 0x22 main sleep period ; 0x23 back sleep period.
 *
 * @param {uint} type
 * @param {function} outputCallBack
 */
power.prototype.getData = function(type, outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'get_data';
        self.dbus_conf_json['signature'] = 'i';
        self.dbus_conf_json['body'] = [type];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res, data) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'get data error!',
                    type:type,
                    result:err,
                    data: null
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'get data success!',
                    type:type,
                    result:res,
                    data: data
                };
                if (res == false){
                    event.code = -1;
                    event.message = 'get data fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'get data exceptions!',
            type:type,
            result:res,
            data: null
        };
        outputCallBack(event);
    });
};

/**
 * set power parameter data to manage power.
 * type
 * 0x00 work mode; int
 * 0x01 main sleep period. int
 * 0x02 back sleep period. int
 * 0x21 main less voltage. double
 *
 * @param {int} type
 * @param {double} data
 * @param {function} outputCallBack
 * @returns
 */
power.prototype.setData = function(type, data, outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'set_data';
        if(type > 0x1F)
        {
            self.dbus_conf_json['signature'] = 'id';
        }else{
            self.dbus_conf_json['signature'] = 'ii';
        }
        self.dbus_conf_json['body']= [type,data];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set data error!',
                    type:type,
                    data:data,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'set data success!',
                    type:type,
                    data:data,
                    result:res
                };
                if (res == false){
                    event.code = -1;
                    event.message = 'set data fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set data exceptions!',
            type:type,
            data:data,
            result:res
        };
        outputCallBack(event);
    });
};


/**
 * set debug level 0~7
 *
 * @param {uint} level  0~7
 * @param {function} outputCallBack
 * @returns
 */
power.prototype.setDebugLevel = function (level, outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'debug_level';
        self.dbus_conf_json['signature'] = 'u';
        self.dbus_conf_json['body']= [level];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err){
                var event = {
                    code:-1,
                    message:'set debug level error !',
                    level:level,
                    result:err
                };
                outputCallBack(event);
            }
            else{
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
