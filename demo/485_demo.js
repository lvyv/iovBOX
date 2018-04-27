var SerialPort = require("serialport");  
var COM = "/dev/ttyO4";
  
var serialPort = new SerialPort(COM, {  
  baudRate: 115200,  
  autoOpen: false  
});   
  
serialPort.open(function (error) {  
  if ( error ) {  
    console.log('failed to open serial: '+error);  
  }   
  else {  
    
    console.log('open serial success,'+COM);  
  }  
});  
  
//console.log('end ,over!');  
      
serialPort.on('data', function(data) {  
    var hex = new Buffer(data);  
    //debugger;  
    console.log('\n->log:\n' + hex);  
    var hexstr = new Buffer(data);  
    hexstr =  hexstr.toString("hex");  
    console.log('<-recv:\n' + hexstr);  
    serialPort.write(data, function(err, results) {  
        console.log('err ' + err);  
        console.log('results ' + results);  
    });  
});  