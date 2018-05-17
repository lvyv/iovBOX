//AMD define(dial_dbus,[], () => {
    var dbus = require('dbus-native');
    //var conn = dbus.createConnection();
    const systemBus = dbus.systemBus();
    const serviceName = 'et.e52x.main';
    const dial_dbus_name = 'et.e52x.media';
    const dial_dbus_path= '/' + dial_dbus_name.replace(/\./g, '/');
    var dbus_conf_json={
            'path': '/et/e52x/media',
            'destination': 'et.e52x.media',
            'interface': 'et.e52x.media',
            'member': 'media_config',
            'signature': 'u',
            'body': [0],
            'type': dbus.messageType.methodCall
    };
    
    var dbus_out_json={
            'path': '/et/e52x/media',
            'destination': 'et.e52x.media',
            'interface': 'et.e52x.media',
            'member': 'media_status',
            'type': dbus.messageType.methodCall
    };
    
    /**
     * request dbus main service.
     * register signals after main service requested.
     * 
     * @param {string} value  service name default as  et.e52x.main
     * @returns {Promise}  to keep sync and confirm request service runned before other interfaces.
     */
    function requestService(value)
    {
        var proc = new Promise((resolve, reject) => {
            systemBus.requestName(value, 0x4, (e, retCode) => {
            // Return code 0x1 means we successfully had the name
                if(retCode === 1) {
                    resolve(retCode);
                }else{
                    reject(e);
                }
            });
        })
        return proc;
    }
    
    var proc = requestService(serviceName);
    
   function initCam(cnt, ipCam_1, path_1, ipCam_2, path_2, outputCallBack)
   {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_init';
            if(cnt == 1)
            {
                dbus_conf_json['signature'] = '(u(ussssss))';
                dbus_conf_json['body'] = [[1,[1,`${ipCam_1}`,'play_out',`${ipCam_1}`,`${path_1}`,'photo_in','photo_out']]];
            }
            else{
                dbus_conf_json['signature'] = '(u(ussssssussssss))';
                dbus_conf_json['body'] = [[1,[1,`${ipCam_1}`,'play_out',`${ipCam_1}`,`${path_1}`,'photo_in','photo_out',2,`${ipCam_2}`,'play_out',`${ipCam_2}`,`${path_2}`,'photo_in','photo_out']]];
            }
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`send ${content} to ${phone} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        }).catch((err)=>{
            console.log(err);
        });
        return;
    }

   
    function getCamInfo(outputCallBack)
    {
        proc.then(()=>{
            dbus_out_json['member']='media_status';
            systemBus.invoke(dbus_out_json, (err, res) => {
                if(err)
                {
                    throw new Error(`get media_status info error!`);
                }else{
                    //do something
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    function recordCam(id, url, path, period, loop, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_record';
            dbus_conf_json['signature'] = 'usssuu';
            dbus_conf_json['body']= [id,'start',`${url}`,`${path}`,period,loop];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`start record cam_${id} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }

    function stopRecord(id, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_record';
            dbus_conf_json['signature'] = 'us';
            dbus_conf_json['body']= [id, 'stop'];
           systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`stop record cam_${id} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    function playCam(id, url, path, time, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_stream';
            dbus_conf_json['signature'] = 'usssu';
            dbus_conf_json['body']= [id, 'start', `${url}`, `${path}`, time];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`start play cam_${id} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    function stopPlay(id, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_stream';
            dbus_conf_json['signature'] = 'us';
            dbus_conf_json['body']= [id, 'stop'];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`stop play cam_${id} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }

    function captureCam(id, url, path, num, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_picture';
            dbus_conf_json['signature'] = 'usssu';
            dbus_conf_json['body']= [id, 'start', `${url}`, `${path}`, num];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`capture cam_${id} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    

    function playFile(path, url, time, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'media_file_stream';
            dbus_conf_json['signature'] = 'sssu';
            dbus_conf_json['body']= ['start', `${path}`, `${url}`, num];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`play file ${path} to server ${url} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    
    /**
     * set dial app debug level as level then debuged 
     * 
     * @param {uint} level 
     * @param {function} outputCallBack 
     * @returns 
     */
    function setDebugLevel(level, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'debug_level';
            dbus_conf_json['signature'] = 'u';
            dbus_conf_json['body']= [level];  
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set debug level "${level}" error !`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    module.exports.initCam = initCam;
    module.exports.getCamInfo = getCamInfo;
    module.exports.recordCam = recordCam;
    module.exports.stopRecord = stopRecord;
    module.exports.playCam = playCam;
    module.exports.stopPlay = stopPlay;
    module.exports.captureCam = captureCam;
    module.exports.playFile = playFile;
    module.exports.setDebugLevel = setDebugLevel;
//}    
