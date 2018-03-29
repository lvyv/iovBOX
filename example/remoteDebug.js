let ssh2_ = require("../src/ssh2promise").SSH2UTILS;
let fs_ = require("fs");
let path_ = require("path");

let rmt1 = new ssh2_();
let host_config_ = rmt1.initConfigSync(fs_, "ssh2.cfg");
//let cmd_kill = "killall -9 node";
//let cmd_cd = "cd /home/lvyu/iovBOX";
let cdPrjRoot = "cd " + path_.posix.join(host_config_.remotePath, path_.basename(host_config_.localPath));
let cmd_node = cdPrjRoot + "\nkillall -9 node\n../bin/node --inspect=192.168.75.130:9229 broker.js\n";

const promise = Promise.resolve('start');
promise
    .then(result => { return rmt1.connect(host_config_); })
    //.then(result => { return rmt1.exec(cmd_kill); })
    //.then(result => { return rmt1.exec(cmd_cd); })
    //.then(result => { return rmt1.exec("mkdir -p tmp-tmp"); })
    .then(result => { return rmt1.exec(cmd_node); })
    .then(result => {return rmt1.disconnect();})
    .catch(error => { console.log(error) });