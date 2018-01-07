var iovDbg = null;
try{
   var iovDbg = require("debug");
}catch(e){
    console.log('tips: debug disable');
}

function iovNoDebug(){

}
function getDebug(mod) {
    if(iovDbg != null){
        //console.log('debug...');
        return iovDbg(mod);
    }
    return iovNoDebug;
} 

exports.getDebug = getDebug;

//var stt = getDebug('broker');
//stt('%s','heeelo');