module.exports = wifi;

function wifi(dbus_app){
    var self = this;
    self.dbus = dbus_app;
    self.wifi_dbus_name = 'et.e52x.wifi';
    self.wifi_dbus_path= '/et/e52x/wifi';
    self.dbus_conf_json={
        path: self.wifi_dbus_path,
        destination: self.wifi_dbus_name,
        interface: self.wifi_dbus_name,
        member: 'wifi_init',
        signature: 'sss',
        body: [0],
        type: self.dbus.dbus.messageType.methodCall
    };

    self.WifiMode = {
      AP:'AP',
      STA:'STA',
      APSTA:'APSTA'
    };

    self.dbus_out_json={
        path: self.wifi_dbus_path,
        destination: self.wifi_dbus_name,
        interface: self.wifi_dbus_name,
        member: 'get_data',
        type: self.dbus.dbus.messageType.methodCall
    };

    self.siganl_status_update = 'wifi_status';

    self.addMatchWifiStatus = function (resolve, reject) {
        self.dbus.systemBus.addMatch("type='signal', member='" + self.siganl_status_update + "'", function(err, value) {
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
    self.dbus.listener_fun_array.push(self.addMatchWifiStatus);
    self.proc = self.dbus.proc;
}

/**
 * 状态报告
 * WIFI Status update
 * @param outputCallBack
 */
wifi.prototype.onWifiStatus = function(outputCallBack){
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.wifi_dbus_path, self.wifi_dbus_name, self.siganl_status_update);
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        //console.log(messageBody);
        var event = {};
        if (messageBody[0] == 0){
            event.status = 'disconnected'
        }
        else if (messageBody[0] == 1){
            event.status = 'connected'
        }
        else {
            event.status = messageBody[0];
        }
        return outputCallBack(event);
    });
};

/**
 * WiFi查询
 * @param outputCallBack
 */
wifi.prototype.queryWifiInfo = function(outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_out_json.member='get_data';
        self.dbus.systemBus.invoke(self.dbus_out_json, function(err, messageBody) {
            if (err){
                var event = {
                    code:-1,
                    message:'queryWifiInfo error!',
                    result:err
                };
                outputCallBack(event);
            }
            else {
                var event = {
                    code:0,
                    message:'queryWifiInfo success!',
                    wifi_info:{}
                };
                event.wifi_info.mode = messageBody[0];
                if (event.wifi_info.mode == self.WifiMode.AP){
                    event.wifi_info.ssid = messageBody[1];
                    event.wifi_info.password = messageBody[2];
                }
                else if(event.wifi_info.mode == self.WifiMode.STA) {
                    event.wifi_info.is_connected = messageBody[1];
                    event.wifi_info.ap_name = messageBody[2];
                    event.wifi_info.password = messageBody[3];
                }
                else if(event.wifi_info.mode == self.WifiMode.APSTA) {
                    event.wifi_info.is_connected = messageBody[1];
                    event.wifi_info.ssid = messageBody[2];
                    event.wifi_info.password = messageBody[3];
                    event.wifi_info.ap_name = messageBody[4];
                    event.wifi_info.ap_password = messageBody[5];
                }
                else {
                    //nothing to do
                }
                return outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'queryWifiInfo exceptions!',
            result:res
        };
        outputCallBack(event);
    });
};

/**
 *
 * WiFi设置AP 注意passwd长度 >=8
 *
 * @param {object} opts
 * {
 *    {string} ssid:
 *    {string} password:
 *    {bool} hidden:
 * }
 * @param outputCallBack
 */
wifi.prototype.setModeAP = function(opts,outputCallBack){
    var self = this;
    self.proc.then(function(){
        if(!opts.ssid || !opts.password){
            throw "param error"
        }
        if (opts.hidden == undefined) {
            opts.hidden = true;
        }
        self.dbus_conf_json.member='wifi_init';
        self.dbus_conf_json.signature = 'sssb';
        self.dbus_conf_json.body= [self.WifiMode.AP,opts.ssid,opts.password,opts.hidden];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if (err){
                var event = {
                    code:-1,
                    message:'setModeAP error!',
                    opts:opts,
                    result:err
                };
                outputCallBack(event);
            }
            else {
                var event = {
                    code:0,
                    message:'setModeAP success!',
                    opts:opts,
                    result:res
                };
                if (res != 0) {
                    event.code = -1;
                    event.message = "setModeAP fail!"
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'setModeAP exceptions!',
            opts:opts,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * WiFi设置STA
 *
 * @param {object} opts
 * {
 *    {string} ap_name:
 *    {string} password
 * }
 * @param outputCallBack
 */
wifi.prototype.setModeSTA = function(opts,outputCallBack){
    var self = this;
    self.proc.then(function(){
        if(!opts.ap_name || !opts.password){
            throw "param error"
        }
        self.dbus_conf_json.member='wifi_init';
        self.dbus_conf_json.signature = 'sss';
        self.dbus_conf_json.body= [self.WifiMode.STA,opts.ap_name,opts.password];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if (err){
                var event = {
                    code:-1,
                    message:'setModeSTA error!',
                    opts:opts,
                    result:err
                };
                outputCallBack(event);
            }
            else {
                var event = {
                    code:0,
                    message:'setModeSTA success!',
                    opts:opts,
                    result:res
                };
                if (res != 0) {
                    event.code = -1;
                    event.message = "setModeSTA fail!"
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'setModeSTA exceptions!',
            opts:opts,
            result:res
        };
        outputCallBack(event);
    });
};

/**
 *
 * @param {object} opts
 * {
 *    {string} ap_name:
 *    {string} ap_password:
 *    {string} ssid:
 *    {string} password:
 *    {bool} hidden:
 * }
 * @param outputCallBack
 */
wifi.prototype.setModeAPSTA = function(opts,outputCallBack){
    var self = this;
    self.proc.then(function(){
        if(!opts.ssid || !opts.password || !opts.ap_name || !opts.ap_password){
            throw "param error"
        }
        if (opts.hidden == undefined) {
            opts.hidden = true;
        }
        self.dbus_conf_json.member='wifi_init';
        self.dbus_conf_json.signature = 'sssssb';
        self.dbus_conf_json.body= [self.WifiMode.APSTA,opts.ap_name,opts.ap_password,opts.ssid,opts.password,opts.hidden];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if (err){
                var event = {
                    code:-1,
                    message:'setModeAPSTA error!',
                    opts:opts,
                    result:err
                };
                outputCallBack(event);
            }
            else {
                var event = {
                    code:0,
                    message:'setModeAPSTA success!',
                    opts:opts,
                    result:res
                };
                if (res != 0) {
                    event.code = -1;
                    event.message = "setModeAPSTA fail!"
                }
                outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'setModeAPSTA exceptions!',
            opts:opts,
            result:res
        };
        outputCallBack(event);
    });
};

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
        c = str.charCodeAt(i++);
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            out += str.charAt(i-1);
            break;
            case 12: case 13:
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

function builderUnicodeString(msg) {
    var len = Math.floor(msg.length / 2);
    var rel = '';
    var odd = msg.length % 2 != 0;
    for (var i = 0; i < len; i++) {
        rel = rel + String.fromCharCode('0x' + msg.substring(i * 2, i * 2 + 2));
    }
    if(odd){
        rel = rel + String.fromCharCode('0x0' + msg[msg.length-1]);
    }
    return rel;
}

wifi.prototype.ScanWiFiAccessPoint = function(outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_out_json.member='scan_ssid';
        self.dbus.systemBus.invoke(self.dbus_out_json, function(err, messageBody) {
            if (err){
                var event = {
                    code:-1,
                    message:'ScanWiFiAccessPoint error!',
                    result:err
                };
                outputCallBack(event);
            }
            else {
                var event = {
                    code:0,
                    message: 'ScanWiFiAccessPoint success!',
                    ap_list: new Array()
                };
                var tmplist = messageBody.split(',');
                for (var i = 0; i < tmplist.length; ++i){
                    var ap_name = tmplist[i];
                    if (ap_name){
                        var flag = '0x';
                        if (ap_name.indexOf(flag) == 0){
                            ap_name = utf8to16(builderUnicodeString(ap_name.substring(flag.length,ap_name.length)));
                        }
                        event.ap_list.push(ap_name);
                    }
                }
                return outputCallBack(event);
            }
        });
    }).catch(function(res){
        var event = {
            code:-1,
            message:'ScanWiFiAccessPoint exceptions!',
            result:res
        };
        outputCallBack(event);
    });
};

/**
 * 调试等级
 * set debug level 0~7
 *
 * @param {uint} level  0~7
 * @param {function} outputCallBack
 * @returns
 */
wifi.prototype.setDebugLevel = function (level, outputCallBack){
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json.member = 'debug_level';
        self.dbus_conf_json.signature = 'u';
        self.dbus_conf_json.body= [level];
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
