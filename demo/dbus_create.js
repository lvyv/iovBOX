var dbus = require('dbus-native');
//var conn = dbus.createConnection();
const systemBus = dbus.systemBus();

module.exports.systemBus = systemBus;
module.exports.dbus = dbus;
