let ssh2_ = require("./ssh2promise").SSH2UTILS;
let fs_ = require("fs");
let host_config_ = {
    host: '192.168.75.130',
    port: 22,
    username: 'lvyu',
    password: '123456'
    //privateKey: require('fs').readFileSync('./id_dsa')
};
let host_config2_ = {
    host: '192.168.75.128',
    port: 22,
    username: 'peter',
    password: '123456'
    //privateKey: require('fs').readFileSync('./id_dsa')
};
//readFileAsync("LICENSE")
rmt1 = new ssh2_();
rmt2 = new ssh2_();
rmt3 = new ssh2_();
rmt4 = new ssh2_();

const promise = Promise.resolve('0');
promise
.then(result=>{console.log(result); rmt1.connect(host_config_); return '1';})
.then(result=>{console.log(result); rmt2.connect(host_config2_); return '2';})
.then(result=>{console.log(result); rmt3.connect(host_config_); return '3';})
.then(result=>{console.log(result); rmt4.connect(host_config2_); return '4';})
.catch(error=>{console.log(error)});

console.log('hello');
//可以工作但到底多少次是成功，多少次失败，
//在程序中无法控制，这是在封装的类中，没有把错误抛出。
//进行Promise封装，解决回调地狱问题
// for (let iii = 1; iii <= 50; iii++) {
//     console.log("第%d次执行\n", iii);
//     let rmt = new ssh2_();
//     doRemoteCmd(rmt);
// };

function doRemoteCmd(rmt) {
    rmt.connect(host_config_, () => {
        rmt.mkdir("./temp1", () => {
            rmt.disconnect();
        });
    });
}

function readFileAsync (file, encoding, cb) {
    if (cb) return fs_.readFile(file, encoding, cb)
  
    return new Promise(function (resolve, reject) {
      fs_.readFile(file, function (err, data) {
        if (err) 
            return reject(err);
        else
            resolve(data);
      })
    })
  }