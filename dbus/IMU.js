//AMD define(imu_dbus,[], () => {
    var dbus = require('dbus-native');
    //var conn = dbus.createConnection();
    const systemBus = dbus.systemBus();
    const serviceName = 'et.e52x.main';
    const imu_dbus_name = 'et.e52x.bmi';
    const imu_dbus_path= '/' + imu_dbus_name.replace(/\./g, '/');
    const signame ='value';
    var dbus_conf_json={
            'path': '/et/e52x/bmi',
            'destination': 'et.e52x.bmi',
            'interface': 'et.e52x.bmi',
            'member': 'sample',
            'signature': 'u',
            'body': [0],
            'type': dbus.messageType.methodCall
    };
    
       
    /**
     * request service and register signal  
     * init proc 
     * @param {string} value  service name
     * @returns {Promise} to keep sync and insure init proc runned before other interfaces.
     */
    function requestService(value)
    {
        var proc = new Promise((resolve, reject) => {
            systemBus.requestName(value, 0x4, (e, retCode) => {
            // Return code 0x1 means we successfully had the name
                if(retCode === 1) {
                    systemBus.addMatch('type=\'signal\', member=\'' + signame + '\'', (err, value) => {
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
                }else{
                    reject(e);
                }
            });
        })
        return proc;
    }
    
    var proc = requestService(serviceName);
    
    /**
     * while IMU report , callback with value
     * {gyro_x,gyro_y,gyro_z,acc_x,acc_y,acc_z}
     * 
     * @param {function} inputCallBack 
     */
    function onIMUReport(inputCallBack)
    {
        var signalFullName = systemBus.mangle(imu_dbus_path, imu_dbus_name, signame);
        systemBus.signals.on(signalFullName, (messageBody) => {
            return inputCallBack(messageBody);
        });
    }
    
    function setSample(sec, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'sample';
            dbus_conf_json['signature'] = 'u';
            dbus_conf_json['body'][0]=sec;
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set imu sample "${sec}"s error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    
    /**
     * set imu report switch on or off call back while success.
     * 
     * @param {uint} enable  1:switch on, 0:switch off
     * @param {function} outputCallBack 
     */
    function setSwitch(enable, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'enable';
            dbus_conf_json['signature'] = 'b';
            dbus_conf_json['body'][0]= enable;
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set imu swtich "${enable}" error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
    }
    
    /**
     * set debug level for imu service 
     * level 0~7
     * 
     * @param {uint} level  debug level 0~7
     * @param {any} outputCallBack 
     * @returns 
     */
    function setDebugLevel(level, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'debug_level';
            dbus_conf_json['signature'] = 'u';
            dbus_conf_json['body'][0]= level;  
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set imu debug level "${level}" error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    module.exports.setDebugLevel = setDebugLevel;
    module.exports.setSample = setSample;
    module.exports.setSwitch = setSwitch;
    module.exports.onIMUReport = onIMUReport;