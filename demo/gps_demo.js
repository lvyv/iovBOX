const dbus_create = require('./dbus_create.js');
const systemBus   = dbus_create.systemBus;
const dbus        = dbus_create.dbus;

const serviceName = 'et.e52x.main';
const remote_targetserviceName = 'et.e52x.gps';
const remote_targetobjectPath = '/' + remote_targetserviceName.replace(/\./g, '/');
var signame = 'raw';
var signalFullName = systemBus.mangle(remote_targetobjectPath, remote_targetserviceName, signame);

systemBus.signals.on(signalFullName, function(messageBody) {
	console.log('' + messageBody);
});

function f1() {
	systemBus.addMatch('type=\'signal\', member=\'' + signame + '\'', function(err, value) {
		try {
			if(err) {
				throw new Error(`addMatch "${signame}" failed: "${err}"`);
			}
			console.log("addMatch OK!");
		} catch(error) {
			console.log(error);
		}
	});
}

function returnResult(result) {
	try {
		let reply = {
			name: 'gps',
			state: result
		};
		var str = JSON.stringify(reply);
		console.log('gps reply:' + str);
	} catch(error) {
		console.log(error);
	}
}

function gps_test() {
	
	systemBus.invoke({
		path: '/et/e52x/gps',
		destination: 'et.e52x.gps',
		'interface': 'et.e52x.gps',
		member: 'config',
		signature: 'i',
		body: [1],
		type: dbus.messageType.methodCall
	}, function(err, res) {
		if(err || res === null) {
			if(err) {
				try {
					throw new Error(`get gps info error: "${err}"`);
				} catch(error) {
					console.log(error);
				}
			}

			returnResult('fail');

		} else {
			console.log('gps:' + res);
			var info = res.toString().split(",");
			if(info[5] == 0) {
				returnResult('fail');
			} else {
				returnResult('pass');
			}
		}
	});
}

function requestServeiceName()
{
	systemBus.requestName(serviceName, 0x4, (e, retCode) => {
		// If there was an error, warn user and fail
		if(e) {
			throw new Error(`Could not request service name "${serviceName}", the error was: "${e}".`);
			return false;
		}
	
		// Return code 0x1 means we successfully had the name
		if(retCode === 1) {
			console.log(`Successfully requested service name "${serviceName}"!`);
			f1();
			return true;
		} else {
			throw new Error(`Failed to request service name "${serviceName}". Check what return code "${retCode}" means.`);
			return false;
		}
	});	
}

//run gps test
requestServeiceName();
gps_test();		
