//AMD define(led_dbus,[], () => {
    var dbus = require('dbus-native');
    //var conn = dbus.createConnection();
    const systemBus = dbus.systemBus();
    const serviceName = 'et.e52x.main';
    const led_dbus_name = 'et.e52x.led';
    const led_dbus_path= '/' + led_dbus_name.replace(/\./g, '/');
    //const signame ='warn_info';
    var dbus_conf_json={
            'path': '/et/e52x/led',
            'destination': 'et.e52x.led',
            'interface': 'et.e52x.led',
            'member': 'debug_level',
            'signature': 'u',
            'body': [6],
            'type': dbus.messageType.methodCall
    };
          
    /**
     * request service and register signal.
     * init proc. 
     * @param {string} value service name
     * @returns {Promise} keep sync and insure init proc runned before other interfaces.
     */
    function requestService(value)
    {
        var proc = new Promise((resolve, reject) => {
            systemBus.requestName(value, 0x4, (e, retCode) => {
            // Return code 0x1 means we successfully had the name
                if(retCode === 1) {
                    //systemBus.addMatch('type=\'signal\', member=\'' + signame + '\'', (err, value) => {
                    resolve("init led ok!");
                    //});
                }else{
                    reject(e);
                }
            });
        })
        return proc;
    }
    
    var proc = requestService(serviceName);
    
    
    /**
     * set certain led to certain color 
     * 
     * @param {uint} ledid 
     * @param {string} color 
     * @param {function} outputCallBack 
     * @returns 
     */
    function setColor(ledid, color, outputCallBack)
    {
        proc.then(()=>{
            if(dbus_conf_json.body.length==1)
            {
                dbus_conf_json.body.splice(1,0,0);
            }

            dbus_conf_json['member'] = 'setone';
            dbus_conf_json['signature'] = 'us';
            dbus_conf_json['body'][0]= ledid;  
            dbus_conf_json['body'][1]= color;  
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set led${ledid} "${color}" error !`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }


    /**
     * set debug level with 0~7 
     * 
     * @param {uint} level  debug level 0~7
     * @param {function} outputCallBack 
     * @returns 
     */
    function setDebugLevel(level, outputCallBack)
    {
        proc.then(()=>{
            if(dbus_conf_json.body.length==2)
            {
                dbus_conf_json.body.splice(1,1);
            }
            dbus_conf_json['member'] = 'debug_level';
            dbus_conf_json['signature'] = 'u';
            dbus_conf_json['body'][0]= level;  
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set debug level "${level}" error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    module.exports.setDebugLevel = setDebugLevel;
    module.exports.setColor = setColor;