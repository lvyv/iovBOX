#!/usr/bin/node
var media=require('../dbus/media.js');
var app_config = require('./app_config.json');

media.setDebugLevel(7,(res)=>{
    console.log('set debug level 7 and res is ' + res);
});

media.initCam(app_config.camera,function(res){
    console.log("init cam from: "+res);
});

media.getCamInfo((res)=>{
    console.log('get cam info: ' + JSON.stringify(res));
});

media.onStatusUpdate((event)=>{
    console.log('status info arrive ' + JSON.stringify(event));
    for (var i = 0; i < event.cam_count; ++i) {
        if(event.cam_list[i].record_status == 3 && event.cam_list[i].record_code == 0)
        {
            media.recordCam(
                event.cam_list[i].cam_index,
                app_config.camera.cam_info[i].ipCam,
                app_config.camera.cam_info[i].path,10,1,(res)=>{
                console.log('record Cam: ' + res);
            });
        }
    }
})

/*
media.playCam(1,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '',5,(res)=>{
        console.log('play Cam: '+res);
});

media.captureCam(1,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '',3,(res)=>{
        console.log('capture Cam: '+res);
});

media.playFile('','',0,(res)=>{
    console.log('play file: '+res);
});
*/