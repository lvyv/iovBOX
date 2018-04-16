//AMD define(imu_dbus,[], () => {
    var dbus = require('dbus-native');
    //var conn = dbus.createConnection();
    const systemBus = dbus.systemBus();
    const serviceName = 'et.e52x.main';
    const gpio_dbus_name = 'et.e52x.bmi';
    const gpio_dbus_path= '/' + gpio_dbus_name.replace(/\./g, '/');
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
    
    function onIMUReport(inputCallBack)
    {
        var signalFullName = systemBus.mangle(gpio_dbus_path, gpio_dbus_name, signame);
        systemBus.signals.on(signalFullName, (messageBody) => {
            return inputCallBack(messageBody);
        });
    }
    
    function setSample(sec, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'sameple';
            dbus_conf_json['signature'] = 'u';
            dbus_conf_json['body'][0]=sec;
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set imu sample "${sec}"s !`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    
    function setSwitch(enable, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'enable';
            dbus_conf_json['signature'] = 'b';
            dbus_conf_json['body'][0]= enable;
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set imu swtich "${enable}" !`);
                }else{
                    outputCallBack(res);
                }
            });
        });
    }
    
    function setDebugLevel(level, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member'] = 'debug_level';
            dbus_conf_json['signature'] = 'u';
            dbus_conf_json['body'][0]= level;  
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set imu swtich "${enable}" !`);
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