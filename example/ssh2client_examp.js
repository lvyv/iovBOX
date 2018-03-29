var fs = require("fs");

var Client = require("ssh2").Client;
var conn = new Client();
var server = JSON.parse(fs.readFileSync("ssh2.cfg_template"));
conn.on('ready', function() {
    console.log(server['host'] + ' ready!\n');
    //var cmd = 'ls -lah';
    //var cmd = 'killall node';
    var cmd = 'node /root/iovBOX/broker.js &';
    conn.exec(cmd, function(err, stream) {
        if (err) throw err;
        stream.on('data', function(data, stderr) {
            if (stderr)
                console.log('STDERR: ' + data);
            else
                console.log('STDOUT: ' + data);
        }).on('exit', function(code, signal) {
            console.log('Exited with code ' + code);
            conn.end();
        });
    });

}).on('error', function(err) {
    console.log(server['host'] + err);
}).on('close', function(had_error) {
    console.log(server['host'] + ' closed！');
}).on('end', function() {
    console.log('server end');
}).
connect(server);