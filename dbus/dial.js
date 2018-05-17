//AMD define(dial_dbus,[], () => {
var dbus = require('dbus-native');
//var conn = dbus.createConnection();
const systemBus = dbus.systemBus();
const serviceName = 'et.e52x.main';
const dial_dbus_name = 'et.e52x.ppp';
const dial_dbus_path= '/' + dial_dbus_name.replace(/\./g, '/');
var dbus_conf_json={
		'path': '/et/e52x/ppp',
		'destination': 'et.e52x.ppp',
		'interface': 'et.e52x.ppp',
		'member': 'debug_level',
		'signature': 'u',
		'body': [0],
		'type': dbus.messageType.methodCall
};

var dbus_out_json={
		'path': '/et/e52x/ppp',
		'destination': 'et.e52x.ppp',
		'interface': 'et.e52x.ppp',
		'member': 'info',
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
                var regsigs = 0;
				systemBus.addMatch('type=\'signal\', member=\'signal\'', (err, value) => {
						if(err) {
							reject(err);
						}
						else{
                            regsigs++;
                            if(regsigs>=3)
                            {
                                resolve(value);
                            }
						}
                });
                systemBus.addMatch('type=\'signal\', member=\'simstat\'', (err, value) => {
						if(err) {
							reject(err);
						}
						else{
                            regsigs++;
                            if(regsigs>=3)
                            {
                                resolve(value);
                            }
						}
                });
                systemBus.addMatch('type=\'signal\', member=\'state\'', (err, value) => {
					if(err) {
						reject(err);
					}
					else{
                        regsigs++;
                        if(regsigs>=3)
                        {
                            resolve(value);
                        }
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
 * callback while dial state changed.  
 * 
 * @param {function} inputCallBack 
 */
function onStateChange(inputCallBack)
{
    var signame = 'state';
    var signalFullName = systemBus.mangle(dial_dbus_path, dial_dbus_name, signame);
	systemBus.signals.on(signalFullName, (messageBody) => {
		return inputCallBack(messageBody);
	});
}

/**
 * callback while dial signal changed. 
 * 
 * @param {function} inputCallBack 
 */
function onSignalChange(inputCallBack)
{
    var signame = 'signal';
    var signalFullName = systemBus.mangle(dial_dbus_path, dial_dbus_name, signame);
	systemBus.signals.on(signalFullName, (messageBody) => {
		return inputCallBack(messageBody);
	});
}

/**
 * callback while sim card state changed. 
 * 
 * @param {function} inputCallBack 
 */
function onSimStateChange(inputCallBack)
{
    var signame = 'simstat';
    var signalFullName = systemBus.mangle(dial_dbus_path, dial_dbus_name, signame);
	systemBus.signals.on(signalFullName, (messageBody) => {
		return inputCallBack(messageBody);
	});
}



/**
 * send msg to phone by 4g dial, callback when finished.
 * 
 * @param {string} phone 
 * @param {string} msg 
 * @param {function} outputCallBack 
 * @returns 
 */
function sendMessage(phone, msg, outputCallBack)
{
	proc.then(()=>{
        dbus_conf_json['member'] = 'send';
        dbus_conf_json['signature'] = 'ss';
		dbus_conf_json['body']= [`${phone}`,`${msg}`];
		systemBus.invoke(dbus_conf_json, (err, res) => {
			if(err)
			{
				throw new Error(`send ${content} to ${phone} error!`);
			}else{
				outputCallBack(res);
			}
		});
	});
	return;
}


/**
 * get dial state info 
 * 
 * @param {function} outputCallBack 
 */
function getInfo(outputCallBack)
{
	proc.then(()=>{
		dbus_out_json['member']='info';
		systemBus.invoke(dbus_out_json, (err, res) => {
			if(err)
			{
				throw new Error(`get dial info error!`);
			}else{
				//do something
				outputCallBack(res);
			}
		});
	});
}

/**
 * get msg list by now 
 * 
 * @param {function} outputCallBack 
 * @returns 
 */
function getList(outputCallBack)
{
    proc.then(()=>{
		dbus_out_json['member']='list';
       systemBus.invoke(dbus_out_json, (err, res) => {
            if(err)
            {
                throw new Error(`get msg list error !`);
            }else{
                outputCallBack(res);
            }
        });
    });
    return;
}

/**
 * delete msg while msgtype and msgid matched.
 * callback when finished.
 * 
 * @param {uint} msgid 
 * @param {uint} msgtype 
 * @param {function} outputCallBack 
 * @returns 
 */
function delMessage(msgid, msgtype,outputCallBack)
{
    proc.then(()=>{
        dbus_conf_json['member'] = 'delete';
        dbus_conf_json['signature'] = 'uu';
		dbus_conf_json['body']= [msgid, msgtype];
		systemBus.invoke(dbus_conf_json, (err, res) => {
			if(err)
			{
				throw new Error(`send ${content} to ${phone} error!`);
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






module.exports.onSignalChange = onSignalChange;
module.exports.onSimStateChange = onSimStateChange;
module.exports.onStateChange = onStateChange;
module.exports.getInfo = getInfo;
module.exports.getList = getList;
module.exports.delMessage = delMessage;
module.exports.sendMessage = sendMessage;

//});