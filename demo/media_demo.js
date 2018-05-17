var media=require('../dbus/media.js');

media.setDebugLevel(7,(res)=>{
    console.log('set debug level 7 and res is ' + res);
});


media.initCam(
    1,
    //'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
    'rtsp://admin:e529xmedia@10.10.100.55/Streaming/Channels/101',
    '/opt/tmp',
    'rtsp://admin:e529xmedia@10.10.100.55/Streaming/Channels/101',
    '/opt/tmp',
    function(res){
        console.log("init cam from: "+res);
    });

media.getCamInfo((res)=>{
        console.log('get cam info:'+res);
    });

media.onStatusUpdate((res)=>{
    console.log(res);
    //record able
    if(res[0][1][3] == 3 && res[0][1][4] == 0) 
    {
        media.recordCam(1,
        //'rtsp://192.168.84.10:554/user=uroot&password=e529xmedia&channel=1&stream=0.sdp?',
        'rtsp://admin:e529xmedia@10.10.100.55/Streaming/Channels/101',
        '/opt/tmp',1,1,(res)=>{
            console.log('record Cam: '+res);
        });
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
