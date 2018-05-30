module.exports = gpio;

function gpio(dbus_app) {
    var self = this;
    self.dbus = dbus_app;
    self.gpio_dbus_name = 'et.e52x.gpio';
    self.gpio_dbus_path= '/' + self.gpio_dbus_name.replace(/\./g, '/');
    self.signame ='change';
    self.dbus_conf_json={
        'path': '/et/e52x/gpio',
        'destination': 'et.e52x.gpio',
        'interface': 'et.e52x.gpio',
        'member': 'output',
        'signature': 'us',
        'body': [0, 'Low'],
        'type': self.dbus.dbus.messageType.methodCall
    };

    self.dbus_input_json={
        'path': '/et/e52x/gpio',
        'destination': 'et.e52x.gpio',
        'interface': 'et.e52x.gpio',
        'member': 'input',
        'type': self.dbus.dbus.messageType.methodCall
    };
    self.addMatchChange = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'' + self.signame + '\'', function(err, value){
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
    self.dbus.listener_fun_array.push(self.addMatchChange);
    self.proc = self.dbus.proc;
}

/**
 * while INPUT IO changed , trigger input call back ,for value is 
 * {IO1 IO2 IO3 IO4 ACC}
 * 当输入通道中任意GPIO有电平变化，触发事件并上报GPIO状态
 *  
 * @param {function} outputCallBack
 */
gpio.prototype.onInputChange = function (outputCallBack) {
	var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.gpio_dbus_path, self.gpio_dbus_name, self.signame);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
    	console.log(messageBody);
        /**
         * messageBody
         * array[
         * uint32: IO1
         * uint32: IO2
         * uint32: IO3
         * uint32: IO4
         * uint32: ACC
         * ]
         * 在具备单片机的主板上ACC采集无效
         */
        var event = {
            io_state:{}
        };
        event.io_state.io1 = messageBody[0];
        event.io_state.io2 = messageBody[1];
        event.io_state.io3 = messageBody[2];
        event.io_state.io4 = messageBody[3];
        event.io_state.acc = messageBody[4];
        outputCallBack(event);
	});
};

/**
 * set the certain channel gpio to low.
 * 
 * @param {uint} channel for channel id 0 or 1.
 * @param {function} outputCallBack  callback after set low is right
 * @returns 
 */
gpio.prototype.setLow = function (channel, outputCallBack) {
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member']='output';
        self.dbus_conf_json['signature']='us';
        self.dbus_conf_json['body']=[channel,'Low'];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
			if(err)
			{
                var event = {
                    code:-1,
                    message:'send low error!',
                    channel:channel,
                    result:err
                };
                outputCallBack(event);
			}else{
                var event = {
                    code:0,
                    message:'send low success!',
                    channel:channel,
                    result:res
                };
                outputCallBack(event);
			}
		});
    }).catch(function(res){
        var event = {
            code:-1,
            message:'send low exception!',
            channel:channel,
            result:res
        };
        outputCallBack(event);
	});
};


/**
 * set the certain channel gpio to high.
 * 
 * @param {any} channel  for channel id 0 to 1.
 * @param {any} outputCallBack  callback after set high is right 
 */
gpio.prototype.setHigh = function(channel, outputCallBack) {
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member']='output';
        self.dbus_conf_json['signature']='us';
        self.dbus_conf_json['body']=[channel,'Hi'];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
			if(err)
			{
                var event = {
                    code:-1,
                    message:'send high error!',
                    channel:channel,
                    result:err
                };
                outputCallBack(event);
			}else{
				//do something
                var event = {
                    code:0,
                    message:'send high success!',
                    channel:channel,
                    result:res
                };
                outputCallBack(event);
			}
		});
    }).catch(function(res){
        var event = {
            code:-1,
            message:'send high exception!',
            channel:channel,
            result:res
        };
        outputCallBack(event);
	});
};

/**
 * get current IO state and  callback with value
 * {IO1 IO2 IO3 IO4 ACC}
 * 
 * @param {function} outputCallBack
 * @returns 
 */
gpio.prototype.getCurrentIOState = function(outputCallBack) {
    var self = this;
    self.proc.then(function(){
        self.dbus.systemBus.invoke(self.dbus_input_json, function(err, messageBody) {
            /**
			 * messageBody
			 * array[
			 * uint32: IO1
			 * uint32: IO2
			 * uint32: IO3
			 * uint32: IO4
			 * uint32: ACC
			 * ]
             * 在具备单片机的主板上ACC采集无效
             */
			if(err)
			{
                var event = {
                    code:-1,
                    message:'get current IO state error!',
                    result:err
                };
                outputCallBack(event);
			}else{
				//do something
                var event = {
                    code:0,
                    message:'get current IO state success!',
                    io_state:{}
                };
                event.io_state.io1 = messageBody[0];
                event.io_state.io2 = messageBody[1];
                event.io_state.io3 = messageBody[2];
                event.io_state.io4 = messageBody[3];
                event.io_state.acc = messageBody[4];
                outputCallBack(event);
			}
	 	});
    }).catch(function(res){
        var event = {
            code:-1,
            message:'get current IO state exception!',
            result:res
        };
        outputCallBack(event);
	});
};

gpio.prototype.setDebugLevel = function(level, outputCallBack){
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