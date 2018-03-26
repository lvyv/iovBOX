start();
    
 
function start() {
    var http = require("http");
    // 创建server，指定处理客户端请求的函数
    http.createServer(function (request, response) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        let sHello = "Hello World!";
        response.write(sHello);// you can change it in the debug mode.
        response.end();
    }).listen(8000);
    console.log("Hello World, iovBOX is listening at prt 8000");
}

function initConfig() {
    try {
        config = JSON.parse(fs.readFileSync(configPath));
    } catch (e) {
        console.log(e)
        fs.createReadStream(path.join(extRoot, '.vscode-upload.json'), {
            autoClose: true
        }).pipe(fs.createWriteStream(configPath, {
            flags: 'w',
            encoding: null,
            mode: '0666',
            autoClose: true
        }));
    }
    if (Array.isArray(config)) {
        if (current >= config.length) {
            current = 0;
        }
        currentConfig = config[current];
    } else {
        currentConfig = config;
    }
}
