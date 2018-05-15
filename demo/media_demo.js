var media=require('../dbus/media.js');

media.initCam(
    1,
<<<<<<< HEAD
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '/media',
=======
    'rtsp://admin:e529xmedia@10.10.100.55/Streaming/Channels/101',
    '/media/mmcblk0p1',
>>>>>>> bf4365f041df81f6c398cbd7edccfcfe7a5292b5
    '',
    '',
    function(res){
        console.log("init cam from: "+res);
    });

media.getCamInfo((res)=>{
        console.log('get cam info:'+res);
<<<<<<< HEAD
    });
    
media.recordCam(0,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '/media/1.avi',5,0,(res)=>{
        console.log('record Cam: '+res);
});

/*
media.playCam(0,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '',5,(res)=>{
        console.log('play Cam: '+res);
});

media.captureCam(0,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '',3,(res)=>{
        console.log('capture Cam: '+res);
});

media.playFile('','',0,(res)=>{
    console.log('play file: '+res);
});
*/
=======
    });
>>>>>>> bf4365f041df81f6c398cbd7edccfcfe7a5292b5
