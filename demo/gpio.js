//AMD define(gpio_dbus,[], () => {
var dbus = require('dbus-native');
//var conn = dbus.createConnection();
const systemBus = dbus.systemBus();
const serviceName = 'et.e52x.main';
const gpio_dbus_name = 'et.e52x.gpio';
const gpio_dbus_path= '/' + gpio_dbus_name.replace(/\./g, '/');
const signame ='change';
var dbus_output_json={
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

function onInputChange(inputCallBack)
{
    var signalFullName = systemBus.mangle(gpio_dbus_path, gpio_dbus_name, signame);
	systemBus.signals.on(signalFullName, (messageBody) => {
		return inputCallBack(messageBody);
	});
}

function setLow(channel, outputCallBack)
{
	proc.then(()=>{
		dbus_output_json['body'][0]=channel;
		dbus_output_json['body'][1]='Low';
		systemBus.invoke(dbus_output_json, (err, res) => {
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


function setHigh(channel, outputCallBack)
{
	proc.then(()=>{
		dbus_output_json['body'][0]=channel;
		dbus_output_json['body'][1]='Hi';
		systemBus.invoke(dbus_output_json, (err, res) => {
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

module.exports.setHigh = setHigh;
module.exports.setLow = setLow;
module.exports.getInput = getInput;
module.exports.onInputChange = onInputChange;

//});