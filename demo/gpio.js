//define(gpio_dbus, () => {
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

function matchSig(err, value)
{
	try {
		if(err) {
			throw new Error(`addMatch "${signame}" failed: "${err}"`);
		}
		console.log("init gpio OK!");
	} catch(error) {
		console.log(error);
	}
}


function requestService(e, retCode)
{
		// Return code 0x1 means we successfully had the name
		if(retCode === 1) {
			systemBus.addMatch('type=\'signal\', member=\'' + signame + '\'', (err, value) => {
				matchSig(err,value);
			});
			return true;
		} 
		throw new Error(`Could not request service ,the error was: ["${e}","${retCode}"].`);
		return false;
}




function start(allCallBack)
{
	systemBus.requestName(serviceName, 0x4, (e, retCode) => {
		if(requestService(e,retCode))
		{
			allCallBack();
		}
	});
}


function onInputChange(inputCallBack)
{
    var signalFullName = systemBus.mangle(gpio_dbus_path, gpio_dbus_name, signame);
	systemBus.signals.on(signalFullName, (messageBody) => {
		return inputCallBack(messageBody);
	});
}


function setLow(channel, outputCallBack)
{
	dbus_output_json['body'][0]=channel;
	dbus_output_json['body'][1]='Low';
	systemBus.invoke(dbus_output_json, (err, res) => {
		if(err)
		{
			throw new Error(`set gpio channel"${channel}" output Low error!`);
		}
		outputCallBack(res);
	});
}



function setHigh(channel, outputCallBack)
{
	dbus_output_json['body'][0]=channel;
	dbus_output_json['body'][1]='Hi';
	systemBus.invoke(dbus_output_json, (err, res) => {
		if(err)
		{
			throw new Error(`set gpio channel"${channel}" output High error!`);
		}
		//do something
		outputCallBack(res);
	});
}

function getInput(inputCallback)
{
	systemBus.invoke(dbus_input_json, (err, res) => {
		if(err)
		{
			throw new Error(`get gpio input value error!`);
		}
		//do something
		inputCallback(res);
	});
}

module.exports.start = start;
module.exports.setHigh = setHigh;
module.exports.setLow = setLow;
module.exports.getInput = getInput;
module.exports.onInputChange = onInputChange;
//});