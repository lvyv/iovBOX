let ssh2_ = require("../src/ssh2promise").SSH2UTILS;
let fs_ = require("fs");
let path_ = require("path");

let rmt1 = new ssh2_();
let host_config_ = rmt1.initConfigSync(fs_, "ssh2.cfg");
let files = rmt1.getAllFiles(fs_, path_, host_config_.localPath, host_config_.exclude);
let num = files.length, n_up = 0;

const promise = Promise.resolve('start');
promise
    .then(result => { return rmt1.connect(host_config_); })
    .then(result => { return rmt1.exec('echo ~'); })
    .then(result => {
        var home_dir = host_config_.remotePath;
        if (home_dir === '~') home_dir = result.trim();
        var rmt_prj_root = path_.posix.join(home_dir, path_.basename(host_config_.localPath));
        files.forEach(element => {
            var rel_path = path_.relative(host_config_.localPath, path_.dirname(element));
            var rpath = path_.posix.join(rmt_prj_root, rel_path);
            rmt1.exec("mkdir -p " + rpath)
                .then(result => {
                    return rmt1.uploadFile(element, path_.posix.join(rpath, path_.basename(element)));
                })
                .then(result => { console.log(result);n_up++; })
                .catch(error => { console.log(error) })
        });
    })
    .catch(error => { console.log(error) });

    //yield 12;
/*

*/

// function doRemoteCmd(rmt) {
//   rmt.connect(host_config_, () => {
//     rmt.uploadFile("c:/meminfo", "/home/lvyu/meminfo", () => {
//       rmt.disconnect();
//     });
//   });
// }