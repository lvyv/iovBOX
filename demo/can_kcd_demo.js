//申请socketcan实例
var vcan=require('socketcan'); 

var network = vcan.parseNetworkDescription("test.kcd");
//创建socketcan通道
var channel = vcan.createRawChannel("can0", true /* ask for timestamps */);
var db      = new vcan.DatabaseService(channel, network.buses["Private"]);


//开启通道
channel.start();

function toHex(number) {
  return ("00000000" + number.toString(16)).slice(-8);
}

//打印数据内容
function dumpPacket(msg) {
  console.log('(' + (msg.ts_sec + msg.ts_usec / 1000000).toFixed(6) + ') ' +
    toHex(msg.id).toUpperCase() + '#' + msg.data.toString('hex').toUpperCase());

    // 显示消息
    let message_info = db.messages[msg.id];
    
    console.log('msgId:' + msg.id);
    console.log('message_info Id:' + message_info.id + ' Name:' + message_info.name);
   
    let db_messages = db.messages[message_info.name];

    for (let signal_name in message_info.signals)
    {
        let db_signal = db_messages.signals[signal_name];

        console.log(db_signal.name + ": " + db_signal.value);
    }

    // 回发数据
    var msg_name     = message_info.name;
    var msg_EMCY_118 = db.messages[msg_name];

    msg_EMCY_118.signals["ManufacturerSpecific2"].update(0);
    msg_EMCY_118.signals["ManufacturerSpecific3"].update(0);
    msg_EMCY_118.signals["ManufacturerSpecific4"].update(500.234);

    db.send(msg_name);
}

//监听数据并打印
channel.addListener("onMessage", dumpPacket);

// 设置间隔定时器，发送can数据
//setInterval(testSendCanData, 50);

function testSendCanData()
{
    var canmsg = { id: 10, data: new Buffer([ 0, 0xFF, 0xFE, 0xFD, 0xFC, 0xFB, 0xFA, 0xF7 ]) };
    console.log("Send");   
    channel.send(canmsg); 
}


