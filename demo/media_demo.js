var media=require('../dbus/media.js');

media.initCam(
    1,
    'rtsp://admin:e529xmedia@10.10.100.55/Streaming/Channels/101',
    '/media/mmcblk0p1',
    '',
    '',
    function(res){
        console.log("init cam from: "+res);
    });

media.getCamInfo((res)=>{
        console.log('get cam info:'+res);
    });