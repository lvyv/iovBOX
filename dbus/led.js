module.exports = led;

function led(dbus_app) {
    var self = this;
    self.dbus = dbus_app;
    self.led_dbus_name = 'et.e52x.led';
    self.led_dbus_path= '/' + self.led_dbus_name.replace(/\./g, '/');
    self.dbus_conf_json={
        'path': '/et/e52x/led',
        'destination': 'et.e52x.led',
        'interface': 'et.e52x.led',
        'member': 'debug_level',
        'signature': 'u',
        'body': [6],
        'type': self.dbus.dbus.messageType.methodCall
    };
    self.addMatchLed = function(resolve,reject){
        resolve("init led ok!");
    };
    self.dbus.listener_fun_array.push(self.addMatchLed);
    self.proc = self.dbus.proc;
}

/**
 * set certain led to certain color
 * @param {uint} ledid   1~4
 * @param {string} color "red black blue cyan orange red white pink green"
 * @param {function} outputCallBack
 * @returns
 */
led.prototype.setColor = function (ledid, color, outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'setone';
        self.dbus_conf_json['signature'] = 'us';
        self.dbus_conf_json['body']= [ledid,color];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set color error!',
                    id:ledid,
                    color:color,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'set color success!',
                    id:ledid,
                    color:color,
                    result:res
                };
                if (res == false){
                    event.code = -1;
                    event.message = 'set color fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set color exceptions!',
            id:ledid,
            color:color,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * set debug level with 0~7
 * @param {uint} level  debug level 0~7
 * @param {function} outputCallBack
 * @returns
 */
led.prototype.setDebugLevel = function (level, outputCallBack){
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
