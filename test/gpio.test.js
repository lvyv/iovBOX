var dbus_app = require('../dbus/dbus_app.js');
var gpiolib = require('../dbus/gpio.js');
var dbus_obj = new dbus_app();
var gpio = new gpiolib(dbus_obj);

dbus_obj.register_app_name();

gpio.setDebugLevel(7,function(res){
    console.log('set debug level :' + JSON.stringify(res));
});

descript("gpio test suit!", ()=>{
    test("gpio test set debug level!", ()=>{
        gpio.setDebugLevel(7,(res)=>{
            expect(res.code).toBe(0);
        });
    });

    test("gpio test get info", ()=>{
        gpio.setLow(0,(res)=>{
            expect(res.code).toBe(0);
        });
        
        gpio.setHigh(0,(res)=>{
            expect(res.code).toBe(0);
        });
        
        gpio.setLow(1,(res)=>{
            expect(res.code).toBe(0);
        });
        
        gpio.setHigh(1,(res)=>{
            expect(res.code).toBe(0);
        });
        
        gpio.getCurrentIOState((res)=>{
            expect(res.code).toBe(0);
        });
    })

    test("gpio signal info", ()=>{
        gpio.onInputChange((res)=>{
            expect(res.code).toBe(0);
        });
    })
});