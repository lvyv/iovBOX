#!/usr/bin/env node

var vcan=require('socketcan');
var channel = vcan.createRawChannel("can0", true /* ask for timestamps */);
channel.start();

function toHex(number) {
  return ("00000000" + number.toString(16)).slice(-8);
}

function dumpPacket(msg) {
  console.log('(' + (msg.ts_sec + msg.ts_usec / 1000000).toFixed(6) + ') ' +
    toHex(msg.id).toUpperCase() + '#' + msg.data.toString('hex').toUpperCase());
}

channel.addListener("onMessage", dumpPacket);

