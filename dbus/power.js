//AMD define(imu_dbus,[], () => {
    var dbus = require('dbus-native');
    //var conn = dbus.createConnection();
    const systemBus = dbus.systemBus();
    const serviceName = 'et.e52x.main';
    const power_dbus_name = 'et.e52x.power';
    const power_dbus_path= '/' + power_dbus_name.replace(/\./g, '/');
    //const signame ='warn_info';
    var dbus_conf_json={
            'path': '/et/e52x/power',
            'destination': 'et.e52x.power',
            'interface': 'et.e52x.power',
            'member': 'set_data',
            'signature': 'ii',
            'body': [0,2.5],
            'type': dbus.messageType.methodCall
    };
    var dbus_out_json={
            'path': '/et/e52x/power',
            'destination': 'et.e52x.power',
            'interface': 'et.e52x.power',
            'member': 'get_data',
            'type': dbus.messageType.methodCall
    };

       
    /**
     * request service and register signal.
     * init proc. 
     * 
     * @param {string} value  service name
     * @returns {Promise} keep sync and insure init proc runned before other interfaces.
     */
    function requestService(value)
    {
        var proc = new Promise((resolve, reject) => {
            systemBus.requestName(value, 0x4, (e, retCode) => {
            // Return code 0x1 means we successfully had the name
                if(retCode === 1) {
                    //systemBus.addMatch('type=\'signal\', member=\'' + signame + '\'', (err, value) => {
                    resolve("init power ok!");
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
     * get warning info for certain type
     * 0~8 
     * @param {uint} type 
     * @param {any} outputCallBack 
     * @returns 
     */
    function getWarnInfo(type, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'warn_info';
            dbus_conf_json['signature'] = 'i';
            dbus_conf_json['body'] = [type];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`get ${type} warn info wrong!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    /**
     * get certain info about power manage. call back after success.
     * 0x00 tempreture;  0x01 main voltage; 0x02 back voltage;
     * 0x04 main voltage less; 0x20 work mode; 0x21 acc state;
     * 0x22 main sleep period ; 0x23 back sleep period.
     * 
     * @param {uint} type  
     * @param {function} outputCallBack 
     */
    function getData(type, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'get_data';
            dbus_conf_json['signature'] = 'i';
            dbus_conf_json['body'] = [type];
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`get power ${type} data wrong!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
    }
   
    /**
     * set power parameter data to manage power.
     * type 
     * 0x00 work mode; int
     * 0x01 main sleep period. int
     * 0x02 back sleep period. int
     * 0x21 main less voltage. double
     * 
     * @param {int} type 
     * @param {double} data 
     * @param {function} outputCallBack 
     * @returns 
     */
    function setData(type, data, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'set_data';
            if(type > 0x1F)
            {
                dbus_conf_json['signature'] = 'id';
            }else{
                dbus_conf_json['signature'] = 'ii';
            }
            dbus_conf_json['body']= [type,data];  
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set power ${type} with ${data} error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }


    /**
     * set debug level 0~7
     * 
     * @param {uint} level  0~7
     * @param {any} outputCallBack 
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
                    throw new Error(`set power debug levet ${level} error !`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    module.exports.setDebugLevel = setDebugLevel;
    module.exports.setData = setData;
    module.exports.getData = getData;
    module.exports.getWarnInfo = getWarnInfo;