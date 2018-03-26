let assert_ = require("assert");
let ssh2_ = require("../src/ssh2promise").SSH2UTILS;
let fs_ = require("fs");
let path_ =  require("path");

let host_config_ = initConfig(fs_, ".ssh2");

rmt1 = new ssh2_();
// rmt2 = new ssh2_();
// rmt3 = new ssh2_();
// rmt4 = new ssh2_();

const promise = Promise.resolve('0');
promise
  .then(result => { console.log(result); return rmt1.connect(host_config_);})
  .then(result => { return rmt1.exec('ls');})
  // .then(result => { console.log(result); rmt2.connect(host_config_); return '2'; })
  // .then(result => { console.log(result); rmt3.connect(host_config_); return '3'; })
  // .then(result => { console.log(result); rmt4.connect(host_config_); return '4'; })
  .catch(error => { console.log(error) });

let files = rmt1.getAllFiles(fs_, path_, "e:\\_proj\\driver\\node-v6.11.3\\Debug\\iovBOX", host_config_.exclude);
console.log(files);
//console.log('hello');
//可以工作但到底多少次是成功，多少次失败，
//在程序中无法控制，这是在封装的类中，没有把错误抛出。
//进行Promise封装，解决回调地狱问题
// for (let iii = 1; iii <= 50; iii++) {
//     console.log("第%d次执行\n", iii);
//     let rmt = new ssh2_();
//     doRemoteCmd(rmt);
// };


// describe('Array', function () {
//   describe('#indexOf()', function () {
//     it('should return -1 when the value is not present', function () {
//       assert.equal(-1, [1, 2, 3].indexOf(5));
//       assert.equal(-1, [1, 2, 3].indexOf(0));
//     })
//   })
// });



// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
// suite("Extension Tests", function () {

//   // Defines a Mocha unit test
//   test("Something 1", function () {
//     assert.equal(-1, [1, 2, 3].indexOf(5));
//     assert.equal(-1, [1, 2, 3].indexOf(8));
//   });
// });


function doRemoteCmd(rmt) {
  rmt.connect(host_config_, () => {
    rmt.mkdir("./temp1", () => {
      rmt.disconnect();
    });
  });
}

function readFileAsync(file, encoding, cb) {
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

function initConfig(fs, config_file) {
  let config = null;
  try {
      config = JSON.parse(fs.readFileSync(config_file));
  } catch (e) {
      console.log(e);
      config = {
        host : "192.168.75.130",
        port: 22,
        username: "lvyu",
        password: "123456",
        exclude : ['e:\\_proj\\driver\\node-v6.11.3\\Debug\\iovBOX\\.git',
        'e:\\_proj\\driver\\node-v6.11.3\\Debug\\iovBOX\\.vscode', 
        'e:\\_proj\\driver\\node-v6.11.3\\Debug\\iovBOX\\.ssh2'] 
      };
      fs.writeFileSync(config_file, JSON.stringify(config));
  }
  return config;
}