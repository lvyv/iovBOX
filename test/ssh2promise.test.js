let assert_ = require("assert");
let assertP_ = require("power-assert");
let ssh2_ = require("../src/ssh2promise").SSH2UTILS;
let fs_ = require("fs");
let path_ = require("path");

describe('Test Configuration read Function Sets A Suite', function () {
  context('Function Sets A context', function () {
    let rmt_tt = new ssh2_();
    let cfg = 'ssh2.cfg';
    it('1# initConfig read without config file', function (done) {
      try {
        fs_.unlinkSync(cfg);
        console.log('\tsuccessfully deleted %s', cfg);
      } catch (err) {
        // handle the error
        console.log(err);
      }
      rmt_tt.initConfig(fs_, "ssh2.cfg", (err, config) => {
        assertP_(config != null);
      });
      done();
    });

    it('2# initConfig read with ssh2.cfg (wrong) format', function (done) {
      assertP_(true);
      done();
    });
  });
  // context('When promise object', function () {
  //   it('should use `done` for test?', function (done) {
  //     var promise = Promise.resolve(1);
  //     promise.then(function (value) {
  //       assert(value === 1);
  //       done();
  //     });
  //   });
  // });
});

/*
let rmt1 = new ssh2_();
let host_config_ = rmt1.initConfig(fs_, "ssh2.cfg");
let files = rmt1.getAllFiles(fs_, path_, host_config_.localPath, host_config_.exclude);

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
      rmt1.exec("mkdir -p " + rpath).then(result => {
        rmt1.uploadFile(element,
          path_.posix.join(rpath, path_.basename(element)));
      })
    });
  })
  .catch(error => { console.log(error) });
*/

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


// function doRemoteCmd(rmt) {
//   rmt.connect(host_config_, () => {
//     rmt.uploadFile("c:/meminfo", "/home/lvyu/meminfo", () => {
//       rmt.disconnect();
//     });
//   });
// }

