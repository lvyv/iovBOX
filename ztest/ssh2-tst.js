let ssh2_ = require("./SSH-UTILS").SSH2UTILS;
let host_config_ = {
    host: '192.168.75.130',
    port: 22,
    username: 'lvyu',
    password: '1261123'
    //privateKey: require('fs').readFileSync('./id_dsa')
};

//可以工作但到底多少次是成功，多少次失败，
//在程序中无法控制，这是在封装的类中，没有把错误抛出。
//进行Promise封装，解决回调地狱问题
for (let iii = 1; iii <= 50; iii++) {
    console.log("第%d次执行\n", iii);
    let rmt = new ssh2_();
    rmt.connect(host_config_, () => {
        rmt.mkdir("./temp", () => {
           rmt.disconnect();
        });
    });
};