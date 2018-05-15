var media=require('../dbus/media.js');

media.initCam(
    1,
    'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    '/media',
    '',
    '',
    function(res){
        console.log("init cam from: "+res);
    });

media.getCamInfo((res)=>{
        console.log('get cam info:'+res);
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
