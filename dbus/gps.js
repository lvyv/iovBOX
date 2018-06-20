module.exports = gps;

function gps(dbus_app){
    var self = this;
    self.dbus = dbus_app;
    self.gps_dbus_name = 'et.e52x.gps';
    self.gps_dbus_path= '/' + self.gps_dbus_name.replace(/\./g, '/');
    self.dbus_conf_json={
            'path': '/et/e52x/gps',
            'destination': 'et.e52x.gps',
            'interface': 'et.e52x.gps',
            'member': 'config',
            'signature': 'i',
            'body': [1],
            'type': self.dbus.dbus.messageType.methodCall
    };
    self.addMatchData = function (resolve, reject){
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'data\'', function(err, value) {
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
    self.addMatchRaw = function(resolve, reject){
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'raw\'', function (err, value) {
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
    self.dbus.listener_fun_array.push(self.addMatchData);
    self.dbus.listener_fun_array.push(self.addMatchRaw);
    self.proc = self.dbus.proc;
}
    
/**
 * while gpsd reported , trigger input call back ,for value is nmea string
 * @param {any} inputCallBack 
 */
gps.prototype.onReportNMEA = function (inputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.gps_dbus_path, self.gps_dbus_name, 'raw');
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        return inputCallBack(messageBody);
    });
};

/**
 * while gpsd reported , trigger input call back ,for value is json 
 * @param {any} inputCallBack 
 */
gps.prototype.onReportData = function (inputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.gps_dbus_path, self.gps_dbus_name, 'data');
    self.dbus.systemBus.signals.on(signalFullName, function (messageBody) {
        var gps_data = messageBody.toString().split(',');
        var gps_json = {
            longitude:gps_data[0],
            latitude:gps_data[1],
            height:gps_data[2],
            longitude_type:gps_data[3],
            latitude_type:gps_data[4],
            position_type:gps_data[5],
            gps_satellite_sum:gps_data[6],
            gps_time:gps_data[7],
            gps_course:gps_data[8],
            gps_velocity:gps_data[9],
            coord_type:'wgs84'
        };
        return inputCallBack(gps_json);
    });
};

gps.prototype.getInfo = function(outputCallBack)
{
    var self = this;
    self.proc.then(function() {
        self.dbus_conf_json['member']='info';
        self.dbus_conf_json['signature']=null;
        self.dbus_conf_json['body']=null;
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set report error!',
                    result:err
                };
                outputCallBack(event);
            }else{
                var gps_data = res.toString().split(',');
                var gps_json = {
                    longitude:gps_data[0],
                    latitude:gps_data[1],
                    height:gps_data[2],
                    longitude_type:gps_data[3],
                    latitude_type:gps_data[4],
                    position_type:gps_data[5],
                    gps_satellite_sum:gps_data[6],
                    gps_time:gps_data[7],
                    gps_course:gps_data[8],
                    gps_velocity:gps_data[9],
                    coord_type:'wgs84'
                };
                var event = {
                    code:1,
                    message: 'get gps info sucessful!',
                    result: gps_json
                }
                outputCallBack(event);
            }
       });
    });
}



/**
 * set the certain report type to gps.
 * 
 * @param {int} type  2==reportdata  1==reportNMEA
 * @param {function} outputCallBack  callback
 */
gps.prototype.setReportType = function (type, outputCallBack)
{
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member']='config';
        self.dbus_conf_json['signature']='i';
        self.dbus_conf_json['body']=[type];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set report error!',
                    type:type,
                    result:err
                };
                outputCallBack(event);
            }else{
                //do something
                var event = {
                    code:0,
                    message:'set report success!',
                    type:type,
                    result:res
                };
                if (res == false){
                    event.code = -1;
                    event.message = 'set report fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set report exception!',
            type:type,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * set the certain report type to gps.
 * 
 * @param {any} enable 1=enable report 0=disable report
 * @param {any} outputCallBack  callback 
 */
gps.prototype.setReportEnable = function (enable, outputCallBack) {
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'enable';
        self.dbus_conf_json['signature'] = 'b';
        self.dbus_conf_json['body']= [enable];  
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set enable exceptions!',
                    enable:enable,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'set enable success!',
                    enable:enable,
                    result:res
                };
                if (res == false){
                    event.code = -1;
                    event.message = 'set enable fail!';
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'set enable exceptions!',
            enable:enable,
            result:res
        };
        outputCallBack(event);
    });
};

gps.prototype.setDebugLevel = function (level, outputCallBack)
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
