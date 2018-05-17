//AMD define(gpio_dbus,[], () => {
var dbus = require('dbus-native');
//var conn = dbus.createConnection();
const systemBus = dbus.systemBus();
const serviceName = 'et.e52x.main';
const gpio_dbus_name = 'et.e52x.gpio';
const gpio_dbus_path= '/' + gpio_dbus_name.replace(/\./g, '/');
const signame ='change';
var dbus_conf_json={
		'path': '/et/e52x/gpio',
		'destination': 'et.e52x.gpio',
		'interface': 'et.e52x.gpio',
		'member': 'output',
		'signature': 'us',
		'body': [0, 'Low'],
		'type': dbus.messageType.methodCall
};

var dbus_input_json={
		'path': '/et/e52x/gpio',
		'destination': 'et.e52x.gpio',
		'interface': 'et.e52x.gpio',
		'member': 'input',
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
 * while INPUT IO changed , trigger input call back ,for value is 
 * {IO1 IO2 IO3 IO4 ACC}
 *  
 * @param {any} inputCallBack 
 */
function onInputChange(inputCallBack)
{
    var signalFullName = systemBus.mangle(gpio_dbus_path, gpio_dbus_name, signame);
	systemBus.signals.on(signalFullName, (messageBody) => {
		return inputCallBack(messageBody);
	});
}

/**
 * set the certain channel gpio to low.
 * 
 * @param {uint} channel for channel id 0 or 1.
 * @param {function} outputCallBack  callback after set low is right
 * @returns 
 */
function setLow(channel, outputCallBack)
{
	proc.then(()=>{
		if(dbus_conf_json.body.length==1)
        {
            dbus_conf_json.body.splice(1,0,0);
        }
		dbus_conf_json['member']='output';
		dbus_conf_json['signature']='us';
		dbus_conf_json['body']=[channel,'Low'];
		systemBus.invoke(dbus_conf_json, (err, res) => {
			if(err)
			{
				throw new Error(`set gpio channel"${channel}" output Low error!`);
			}else{
				outputCallBack(res);
			}
		});
	});
	return;
}


/**
 * set the certain channel gpio to high.
 * 
 * @param {any} channel  for channel id 0 to 1.
 * @param {any} outputCallBack  callback after set high is right 
 */
function setHigh(channel, outputCallBack)
{
	proc.then(()=>{
		if(dbus_conf_json.body.length==1)
        {
            dbus_conf_json.body.splice(1,0,0);
        }
		dbus_conf_json['member']='output';
		dbus_conf_json['signature']='us';
		dbus_conf_json['body']=[channel,'Hi'];
		systemBus.invoke(dbus_conf_json, (err, res) => {
			if(err)
			{
				throw new Error(`set gpio channel"${channel}" output High error!`);
			}else{
				//do something
				outputCallBack(res);
			}
		});
	});
}

/**
 * get current IO state and  callback with value
 * {IO1 IO2 IO3 IO4 ACC}
 * 
 * @param {function} inputCallback 
 * @returns 
 */
function getInput(inputCallback)
{
	proc.then(()=>{
		systemBus.invoke(dbus_input_json, (err, res) => {
			if(err)
			{
				throw new Error(`get gpio input value error!`);
			}else{
				//do something
				inputCallback(res);
			}
	 	});
	});
	return;
}

function setDebugLevel(level, outputCallBack)
{
    proc.then(()=>{
		if(dbus_conf_json.body.length==2)
        {
            dbus_conf_json.body.splice(1,1);
        }
        dbus_conf_json['member'] = 'debug_level';
        dbus_conf_json['signature'] = 'u';
        dbus_conf_json['body']= [level];  
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

module.exports.setHigh = setHigh;
module.exports.setLow = setLow;
module.exports.getInput = getInput;
module.exports.onInputChange = onInputChange;
module.exports.setDebugLevel = setDebugLevel;

//});