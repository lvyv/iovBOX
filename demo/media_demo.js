#!/usr/bin/node
var dbus_app = require('../dbus/dbus_app.js');
var medialib=require('../dbus/media.js');
var app_config = require('./app_config.json');
var dbus_obj = new dbus_app();
var media = new medialib(dbus_obj);

dbus_obj.register_app_name();

media.setDebugLevel(7,function(res){
    console.log('set debug ' + JSON.stringify(res));
});

var config = {
    cam_info:[]
};

for(var i = 0 ; i < app_config.camera.cam_info.length; ++i) {
    var cam = {};
    cam.ipCam = app_config.camera.cam_info[i].record_url;
    cam.path = app_config.camera.cam_info[i].record_path;
    cam.record_cycle = app_config.camera.cam_info[i].record_cycle;
    cam.cycle = app_config.camera.cam_info[i].cycle;
    config.cam_info[i] = cam;
}

media.initCam(config,function(res){
    console.log("init cam: " + JSON.stringify(res));
});

media.getCamInfo(function(res){
    console.log('get cam info: ' + JSON.stringify(res));
});

media.onStatusUpdate(function(event){
    console.log('status info arrive ' + JSON.stringify(event));
    for (var i = 0; i < event.cam_count; ++i) {
        if(event.cam_list[i].record_status == 3 && event.cam_list[i].record_code == 0)
        {
            console.log("cam index: " + event.cam_list[i].cam_index + " status normal, can record !!");
            media.recordCam(
                event.cam_list[i].cam_index,
                config.cam_info[i].ipCam,
                config.cam_info[i].path,
                config.cam_info[i].record_cycle,
                config.cam_info[i].cycle,
                function(res) {
                    console.log('record Cam: ' + JSON.stringify(res));
                    if(res.code == 0){
                        //success
                    }
                });

            // media.captureCam(
            //     event.cam_list[i].cam_index,
            //     app_config.camera.cam_info[i].ipCam,
            //     app_config.camera.cam_info[i].path, 3, function(res){
            //         console.log('capture Cam: ' + JSON.stringify(res));
            // });
        }
    }
});

/*
media.playCam(1,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '',5,function(res){
        console.log('play Cam: '+res);
});

media.captureCam(1,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '',3,function(res){
        console.log('capture Cam: '+res);
});

media.playFile('','',0,function(res){
    console.log('play file: '+res);
});
*/