module.exports = adc;

function adc(dbus_app) {
    var self = this;
    self.dbus = dbus_app;
    self.adc_dbus_name = 'et.e52x.adc';
    self.adc_dbus_path= '/' + self.adc_dbus_name.replace(/\./g, '/');
    self.signame ='value';
    self.dbus_conf_json={
        'path': '/et/e52x/adc',
        'destination': 'et.e52x.adc',
        'interface': 'et.e52x.adc',
        'member': 'sample',
        'signature': 'u',
        'body': [0],
        'type': self.dbus.dbus.messageType.methodCall
    };

    self.addMatchValue = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'' + self.signame + '\'', function(err, value) {
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
    self.dbus.listener_fun_array.push(self.addMatchValue);
    self.proc = self.dbus.proc;
}
    
/**
 * while adc report , callback with value
 * {ad0,ad1}
 *
 * @param {function} outputCallBack
 */
adc.prototype.onADCReport= function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.adc_dbus_path, self.adc_dbus_name, self.signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        /**
         * messageBody[0]
         * array[
         * double：AD0 
         * double：AD1
         * ]
         * 输入数据分别：AD0 AD1 2个数据
         */
        var event = {
            adc_info:{}
        };
        event.adc_info.AD0 = messageBody[0][0];
        event.adc_info.AD1 = messageBody[0][1];
        return outputCallBack(event);
    });
};

/**
 * 设置采样周期，单位（毫秒）
 * @param sec(>=50ms)
 * @param outputCallBack
 */
adc.prototype.setSample = function(sec, outputCallBack){
    var self = this;

    self.proc.then( function (){
        if(sec < 50) {
            var event = {
                code:-1,
                message:'sec little than 50 error',
                sec:sec
            };
            outputCallBack(event);
            return;
        }

        self.dbus_conf_json['member'] = 'set_sample';
        self.dbus_conf_json['signature'] = 'u';
        self.dbus_conf_json['body']=[sec];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set sample error!',
                    sec:sec,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'set sample success!',
                    sec:sec,
                    result:res
                };
                if (res == true){
                    event.code = -1;
                    event.message = 'set sample fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set sample exception!',
            sec:sec,
            result:res
        };
        outputCallBack(event);
    });
};


/**
 * set adc report switch on or off call back while success.
 *
 * @param {uint} enable  1:switch on, 0:switch off
 * @param {function} outputCallBack
 */
adc.prototype.setSwitch = function(enable, outputCallBack) {
    var self = this;
    self.proc.then( function (){
        self.dbus_conf_json['member'] = 'enable';
        self.dbus_conf_json['signature'] = 'b';
        self.dbus_conf_json['body']= [enable];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set switch error!',
                    enable:enable,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'set switch success!',
                    enable:enable,
                    result:res
                };
                if (res == true){
                    event.code = -1;
                    event.message = 'set switch fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set switch exception!',
            enable:enable,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * set debug level for adc service
 * level 0~7
 *
 * @param {uint} level  debug level 0~7
 * @param {function} outputCallBack
 * @returns
 */
adc.prototype.setDebugLevel = function(level, outputCallBack){
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