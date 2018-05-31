module.exports = imu;

function imu(dbus_app) {
    var self = this;
    self.dbus = dbus_app;
    self.imu_dbus_name = 'et.e52x.bmi';
    self.imu_dbus_path= '/' + self.imu_dbus_name.replace(/\./g, '/');
    self.signame ='value';
    self.dbus_conf_json={
        'path': '/et/e52x/bmi',
        'destination': 'et.e52x.bmi',
        'interface': 'et.e52x.bmi',
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
 * while IMU report , callback with value
 * {gyro_x,gyro_y,gyro_z,acc_x,acc_y,acc_z}
 *
 * @param {function} outputCallBack
 */
imu.prototype.onIMUReport = function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.imu_dbus_path, self.imu_dbus_name, self.signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        /**
         * messageBody[0]
         * array[
         * double：ACx
         * double：ACy
         * double：ACz
         * double：ANx
         * double：ANy
         * double：ANz
         * ]
         * 输入数据分别：ACx,ACy,ACz,ANx,ANy,ANz 6个数据
         */
        var event = {
            imu_info:{}
        };
        event.imu_info.ACx = messageBody[0][0];
        event.imu_info.ACy = messageBody[0][1];
        event.imu_info.ACz = messageBody[0][2];
        event.imu_info.ANx = messageBody[0][3];
        event.imu_info.ANy = messageBody[0][4];
        event.imu_info.ANz = messageBody[0][5];
        return outputCallBack(event);
    });
};

/**
 * 设置采样周期，单位（秒）
 * @param sec
 * @param outputCallBack
 */
imu.prototype.setSample = function(sec, outputCallBack){
    var self = this;
    self.proc.then( function (){
        self.dbus_conf_json['member'] = 'sample';
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
                if (res == false){
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
 * set imu report switch on or off call back while success.
 *
 * @param {uint} enable  1:switch on, 0:switch off
 * @param {function} outputCallBack
 */
imu.prototype.setSwitch = function(enable, outputCallBack) {
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
                if (res == false){
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
 * set debug level for imu service
 * level 0~7
 *
 * @param {uint} level  debug level 0~7
 * @param {function} outputCallBack
 * @returns
 */
imu.prototype.setDebugLevel = function(level, outputCallBack){
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