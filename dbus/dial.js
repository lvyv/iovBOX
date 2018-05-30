module.exports = dial;
module.exports.Dial_State = Dial_State;

var Dial_State = {
    1:"dial init",
    2:"dial start",
    3:"dial running",
    4:"dial stopping",
    5:"dial stopped",
    6:"dial none"
};

function dial(dbus_app) {
	var self = this;
	self.dbus = dbus_app;
    self.dial_dbus_name = 'et.e52x.ppp';
    self.dial_dbus_path= '/' + self.dial_dbus_name.replace(/\./g, '/');
    self.dbus_conf_json={
        'path': '/et/e52x/ppp',
        'destination': 'et.e52x.ppp',
        'interface': 'et.e52x.ppp',
        'member': 'debug_level',
        'signature': 'u',
        'body': [0],
        'type': self.dbus.dbus.messageType.methodCall
    };

    self.dbus_out_json = {
        'path': '/et/e52x/ppp',
        'destination': 'et.e52x.ppp',
        'interface': 'et.e52x.ppp',
        'member': 'info',
        'type': self.dbus.dbus.messageType.methodCall
    };

    self.addMatchSignal = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'signal\'', function(err, value) {
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

    self.addMatchSimstat = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'simstat\'', function(err, value) {
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

    self.addMatchState = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'state\'', function(err, value) {
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

    self.addMatchNetwork = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'network\'', function(err, value) {
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
    self.dbus.listener_fun_array.push(self.addMatchSignal);
    self.dbus.listener_fun_array.push(self.addMatchSimstat);
    self.dbus.listener_fun_array.push(self.addMatchState);
    self.dbus.listener_fun_array.push(self.addMatchNetwork);
    self.proc = self.dbus.proc;
}

/**
 * callback while dial state changed.  
 * 
 * @param {function} inputCallBack 
 */
dial.prototype.onStateChange = function (inputCallBack) {
    var self = this;
    var signame = 'state';
    var signalFullName = self.dbus.systemBus.mangle(self.dial_dbus_path, self.dial_dbus_name, signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        /**
         * messageBody[0]
         * 0x01:ST_TTY_DIAL_INIT
         * 0x02:ST_TTY_DIAL_START
         * 0x03:ST_TTY_DIAL_RUNNING
         * 0x04:ST_TTY_DIAL_STOPPING
         * 0x05:ST_TTY_DIAL_STOPPED
         * 0x06:ST_TTY_DIAL_NONE
         */
		return inputCallBack(Dial_State[messageBody[0]]);
	});
};

/**
 * callback while dial signal changed. 
 * 
 * @param {function} inputCallBack 
 */
dial.prototype.onSignalChange = function (inputCallBack) {
    var self = this;
    var signame = 'signal';
    var signalFullName = self.dbus.systemBus.mangle(self.dial_dbus_path, self.dial_dbus_name, signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        /**
         * messageBody[0]: true or false
         * false：无信号
         * true： 信号正常
         */
        var signal = '';
        if (messageBody[0] == false){
            signal = 'no signal';
        }
        else if (messageBody[0] == true){
            signal = 'normal signal';
        }
		return inputCallBack(signal);
	});
};

/**
 * callback while sim card state changed. 
 * 
 * @param {function} inputCallBack 
 */
dial.prototype.onSimStateChange = function (inputCallBack) {
    var self = this;
    var signame = 'simstat';
    var signalFullName = self.dbus.systemBus.mangle(self.dial_dbus_path, self.dial_dbus_name, signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        console.log(messageBody);
		return inputCallBack(messageBody);
	});
};

/**
 * callback while network changed.
 *
 * @param {function} inputCallBack
 */
dial.prototype.onNetworkChange = function (inputCallBack) {
    var self = this;
    var signame = 'network';
    var signalFullName = self.dbus.systemBus.mangle(self.dial_dbus_path, self.dial_dbus_name, signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        var event = {
            dial_info:{}
        };
        event.dial_info.operator_identification = messageBody[0][0];
        event.dial_info.rssi = messageBody[0][1];
        event.dial_info.base_station_stat = messageBody[0][2][0];
        event.dial_info.cell_id = messageBody[0][2][1];
        event.dial_info.base_station_id = messageBody[0][2][2];
        event.dial_info.reason = messageBody[0][2][3];
        return inputCallBack(event);
    });
};

/**
 * send msg to phone by 4g dial, callback when finished.
 * 
 * @param {string} phone 
 * @param {string} msg 
 * @param {function} outputCallBack 
 * @returns 
 */
dial.prototype.sendMessage = function (phone, msg, outputCallBack) {
    var self = this;
    self.proc.then( function (){
        self.dbus_conf_json['member'] = 'send';
        self.dbus_conf_json['signature'] = 'ss';
        self.dbus_conf_json['body']= [phone,msg];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
			if(err)
			{
                var event = {
                    code:-1,
                    message:'send message error!',
                    phone:phone,
                    content:msg,
                    result:err
                };
                outputCallBack(event);
			}else{
                var event = {
                    code:0,
                    message:'send message success!',
                    phone:phone,
                    content:msg,
                    result:res
                };
                outputCallBack(event);
			}
		});
    }).catch(function(res){
        var event = {
            code:-1,
            message:'send message exception!',
            phone:phone,
            content:msg,
            result:res
        };
        outputCallBack(event);
    });
};


/**
 * get dial state info 
 * 
 * @param {function} outputCallBack 
 */
dial.prototype.getInfo = function (outputCallBack) {
    var self = this;
    self.proc.then( function(){
        self.dbus_out_json['member']='info';
        self.dbus.systemBus.invoke(self.dbus_out_json, function(err, messageBody) {
			if(err)
			{
                var event = {
                    code:-1,
                    message:'get sim card info error!',
                    result:err
                };
                outputCallBack(event);
			}else{
				//do something
                var event = {
                    code:0,
                    message:'get sim card info success!',
                    dial_info:{}
                };
                if(messageBody != false){
                    event.dial_info.ccid = messageBody[0];
                    event.dial_info.cimi = messageBody[1];
                    event.dial_info.phone_number = messageBody[2];
                    event.dial_info.network_identity = messageBody[3];
                    event.dial_info.operator_identification = messageBody[4];
                    event.dial_info.rssi = messageBody[5];
                    event.dial_info.base_station_stat = messageBody[6][0];
                    event.dial_info.cell_id = messageBody[6][1];
                    event.dial_info.base_station_id = messageBody[6][2];
                    event.dial_info.reason = messageBody[6][3];
                }
                outputCallBack(event);
			}
		});
    }).catch(function(res){
        var event = {
            code:-1,
            message:'get sim card exception!',
            type:type,
            result:res
        };
        outputCallBack(event);
	});
}

/**
 * get msg list by now 
 * 
 * @param {function} outputCallBack 
 * @returns 
 */
dial.prototype.getMessageList = function(status,outputCallBack) {
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member']='list';
        self.dbus_conf_json['signature'] = 'u';
        self.dbus_conf_json['body']= [status];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'get msg list error!',
                    status:status,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'get msg list success!',
                    status:status,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'get msg list exception!',
            status:status,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * delete msg while msgtype and msgid matched.
 * callback when finished.
 * 
 * @param {uint} msgid 
 * @param {uint} msgtype 
 * @param {function} outputCallBack 
 * @returns 
 */
dial.prototype.deleteMessage = function(msgid, msgtype,outputCallBack) {
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'delete';
        self.dbus_conf_json['signature'] = 'uu';
        self.dbus_conf_json['body']= [msgid, msgtype];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
			if(err)
			{
                var event = {
                    code:-1,
                    message:'delete message error!',
                    type:msgtype,
                    id:msgid,
                    result:err
                };
                outputCallBack(event);
			}else{
                var event = {
                    code:0,
                    message:'delete message success!',
                    type:msgtype,
                    id:msgid,
                    result:res
                };
                outputCallBack(event);
			}
		});
    }).catch(function(res){
        var event = {
            code:-1,
            message:'delete message exception!',
            type:msgtype,
            id:msgid,
            result:res
        };
        outputCallBack(event);
	});
};



/**
 * set dial app debug level as level then debuged 
 * 
 * @param {uint} level 
 * @param {function} outputCallBack 
 * @returns 
 */
dial.prototype.setDebugLevel = function(level, outputCallBack) {
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