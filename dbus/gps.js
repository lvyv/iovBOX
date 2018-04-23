//AMD define(gps_dbus,[], () => {
    var dbus = require('dbus-native');
    //var conn = dbus.createConnection();
    const systemBus = dbus.systemBus();
    const serviceName = 'et.e52x.main';
    const gps_dbus_name = 'et.e52x.gps';
    const gps_dbus_path= '/' + gps_dbus_name.replace(/\./g, '/');
    var signame ='raw';
    var dbus_conf_json={
            'path': '/et/e52x/gps',
            'destination': 'et.e52x.gps',
            'interface': 'et.e52x.gps',
            'member': 'config',
            'signature': 'i',
            'body': [1],
            'type': dbus.messageType.methodCall
    };
        
    /**
     * request service and later register signal service 
     * initial proc
     * 
     * @param {any} value 
     * @returns 
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
     * while gpsd reported , trigger input call back ,for value is json or string
     * @param {any} inputCallBack 
     */
    function onReport(inputCallBack)
    {
        var signalFullName = systemBus.mangle(gps_dbus_path, gps_dbus_name, signame);
        systemBus.signals.on(signalFullName, (messageBody) => {
            return inputCallBack(messageBody);
        });
    }
    
    
    /**
     * set the certain report type to gps.
     * 
     * @param {any} type 
     * @param {any} outputCallBack  callback 
     */
    function setReportType(type, outputCallBack)
    {
        proc.then(()=>{
            dbus_conf_json['member']='config';
            dbus_conf_json['signature']='i';
            dbus_conf_json['body'][0]=type;
            systemBus.invoke(dbus_conf_json, (err, res) => {
                if(err)
                {
                    throw new Error(`set gps reportType "${type}" error!`);
                }else{
                    //do something
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
                    throw new Error(`set gps debug level "${level}" error!`);
                }else{
                    outputCallBack(res);
                }
            });
        });
        return;
    }
    
    module.exports.setReportType = setReportType;
    module.exports.onReport = onReport;
    module.exports.setDebugLevel = setDebugLevel;
    
    //});