module.exports = media;

function media(dbus_app){
    var self = this;
    self.dbus = dbus;
    self.media_dbus_name = 'et.e52x.media';
    self.media_dbus_path= '/' + self.media_dbus_name.replace(/\./g, '/');
    self.dbus_conf_json={
            'path': '/et/e52x/media',
            'destination': 'et.e52x.media',
            'interface': 'et.e52x.media',
            'member': 'media_config',
            'signature': 'u',
            'body': [0],
            'type': self.dbus.dbus.messageType.methodCall
    };

    self.dbus_out_json={
            'path': '/et/e52x/media',
            'destination': 'et.e52x.media',
            'interface': 'et.e52x.media',
            'member': 'media_status',
            'type': self.dbus.dbus.messageType.methodCall
    };
    self.addMatchStatusUpdate = function (resolve, reject) {
        self.dbus.systemBus.addMatch('type=\'signal\', member=\'status_update\'', function(err, value) {
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
    self.dbus.listener_fun_array.push(self.addMatchStatusUpdate);
    self.proc = self.dbus.proc;
}

media.prototype.onStatusUpdate = function (inputCallBack)
{    
    var self = this;
    var signalFullName = self.dbus.systemBus.mangle(self.media_dbus_path, self.media_dbus_name, 'status_update');
    self.dbus.systemBus.signals.on(signalFullName, function(messageBody) {
        var event={
            cam_count:messageBody[0][0]
        };
        if(event.cam_count != 0) {
            event.cam_list = [];
        }
        for (var i = 0; i < event.cam_count; ++i) {
            var camera = {
                cam_index:messageBody[0][i+1][0],
                push_status:messageBody[0][i+1][1],
                push_code:messageBody[0][i+1][2],
                record_status:messageBody[0][i+1][3],
                record_code:messageBody[0][i+1][4]
            };
            event.cam_list[i] = camera;
        }
        return inputCallBack(event);
    });
};

/**
 * 
 * @param {object} cam_config
 * {
 *     cam_info:[
 *         {
 *             ipCam:'',
 *             path:''
 *         },
 *         {
 *             ipCam:'',
 *             path:''
 *         },
 *         {
 *             ipCam:'',
 *             path:''
 *         }
 *     ]
 * } 
 * @param {function} outputCallBack 
 */
media.prototype.initCam = function (cam_config, outputCallBack)
{
    if (!cam_config.cam_info) {
        var event = {
            code:-1,
            message:'cam_info param error'
        };
        outputCallBack(event);
        return;
    }

    if (cam_config.cam_info.length == 0) {
        var event = {
            code:-1,
            message:'warring cam number 0'
        };
        outputCallBack(event);
        return;
    }

    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'media_init';
        var cnt = cam_config.cam_info.length;
        self.dbus_conf_json['signature'] = '(u';
        self.dbus_conf_json['body'] = [ [cnt] ];
        for( var i = 0; i < cnt; ++i ) {
            var ipCam = cam_config.cam_info[i].ipCam;
            var path = cam_config.cam_info[i].path;
            var param = [i+1, ipCam, 'play_out', ipCam, path, 'photo_in', 'photo_out'];
            self.dbus_conf_json['body'][0][i+1] = param;
            self.dbus_conf_json['signature'] += '(ussssss)';
        }
        self.dbus_conf_json['signature'] += ')';
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'media_init error!',
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'media_init success!',
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_init exceptions!',
            result:err
        };
        outputCallBack(event);
    });
};

media.prototype.getCamInfo = function (outputCallBack)
{
    var self = this;
    self.proc.then(function(){
        self.dbus_out_json['member']='media_status';
        self.dbus.systemBus.invoke(self.dbus_out_json, function(err, messageBody) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'get media_status info error!',
                    result:err
                };
                outputCallBack(event);
            }else{
                //do something
                var event={
                    code:0,
                    message:'get media_status info success!',
                    cam_count:messageBody[0]
                };
                if(event.cam_count != 0) {
                    event.cam_list = [];
                }
                for (var i = 0; i < event.cam_count; ++i) {
                    var camera = {
                        cam_index:messageBody[i+1][0],
                        push_status:messageBody[i+1][1],
                        push_code:messageBody[i+1][2],
                        record_status:messageBody[i+1][3],
                        record_code:messageBody[i+1][4]
                    };
                    event.cam_list[i] = camera;
                }
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_status exceptions!',
            result:err
        };
        outputCallBack(event);
    });
};

media.prototype.recordCam = function (id, url, path, period, loop, outputCallBack)
{
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'media_record';
        self.dbus_conf_json['signature'] = 'usssuu';
        self.dbus_conf_json['body']= [id,'start',url,path,period,loop];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'start media_record fail!',
                    cam_index:id,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'start media_record success!',
                    cam_index:id,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_record exceptions!',
            cam_index:id,
            result:err
        };
        outputCallBack(event);
    });
};

media.prototype.stopRecord = function (id, outputCallBack)
{
    var self = this;
    self.proc.then( function(){
        self.dbus_conf_json['member'] = 'media_record';
        self.dbus_conf_json['signature'] = 'us';
        self.dbus_conf_json['body']= [id, 'stop'];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function (err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'stop media_record fail!',
                    cam_index:id,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'stop media_record success!',
                    cam_index:id,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_record exceptions!',
            cam_index:id,
            result:err
        };
        outputCallBack(event);
    });
};

media.prototype.playCam = function (id, url, path, time, outputCallBack)
{
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'media_stream';
        self.dbus_conf_json['signature'] = 'usssu';
        self.dbus_conf_json['body']= [id, 'start', url, path, time];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'start media_stream fail!',
                    cam_index:id,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'start media_stream success!',
                    cam_index:id,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_stream exceptions!',
            cam_index:id,
            result:err
        };
        outputCallBack(event);
    });
};

media.prototype.stopPlay = function (id, outputCallBack)
{
    var self = this;
    self.proc.then(function() {
        self.dbus_conf_json['member'] = 'media_stream';
        self.dbus_conf_json['signature'] = 'us';
        self.dbus_conf_json['body']= [id, 'stop'];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'stop media_stream fail!',
                    cam_index:id,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'stop media_stream success!',
                    cam_index:id,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_stream exceptions!',
            cam_index:id,
            result:err
        };
        outputCallBack(event);
    });
};

media.prototype.captureCam = function (id, url, path, num, outputCallBack)
{
    var self = this;
    self.proc.then(function() {
        self.dbus_conf_json['member'] = 'media_picture';
        self.dbus_conf_json['signature'] = 'usssu';
        self.dbus_conf_json['body']= [id, 'start', url, path, num];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'media_picture fail!',
                    cam_index:id,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'media_picture success!',
                    cam_index:id,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_picture exceptions!',
            cam_index:id,
            result:err
        };
        outputCallBack(event);
    });
};


media.prototype.playFile = function (path, url, time, outputCallBack)
{
    var self = this;
    self.proc.then(function(){
        self.dbus_conf_json['member'] = 'media_file_stream';
        self.dbus_conf_json['signature'] = 'sssu';
        self.dbus_conf_json['body']= ['start', path, url, time];
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res)  {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'media_file_stream fail!',
                    path:path,
                    url:url,
                    result:err
                };
                outputCallBack(event);
            }else{
                var event = {
                    code:0,
                    message:'media_file_stream success!',
                    path:path,
                    url:url,
                    result:res
                };
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'media_file_stream exceptions!',
            path:path,
            url:url,
            result:err
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
media.prototype.setDebugLevel = function (level, outputCallBack)
{
    var self = this;
    self.proc.then(function() {
        self.dbus_conf_json['member'] = 'debug_level';
        self.dbus_conf_json['signature'] = 'u';
        self.dbus_conf_json['body']= [level];  
        self.dbus.systemBus.invoke(self.dbus_conf_json, function(err, res) {
            if(err)
            {
                var event = {
                    code:-1,
                    message:'set debug level error !',
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
                outputCallBack(event);
            }
        });
    }).catch(function(err) {
        var event = {
            code:-1,
            message:'debug_level exceptions!',
            level:level,
            result:err
        };
        outputCallBack(event);
    });
};
