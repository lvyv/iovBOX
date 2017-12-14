Browser-----iovBOX-----OBJ SVR

1. 启动一个tftp SVR作为目标服务器
192.168.75.130$ ./server

2. 启动nodejs，并运行broker.js
E:\_proj\driver\node-v6.11.3\Debug>node --inspect .\iovBOX\broker.js
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/remote/serve_file/@60cd6e859b9f557d2312f5bf532f6aec5f284980/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/977e52f5-96c3-492f-b16b-7938fbdc56a7

3. 启动chrome，地址栏输入上一步的chrome-devtools://......，按热键ctrl+shift+I，点击工具栏的第三个钮open dedicated DevTools for Node.js，弹出调试窗口

4. 打开一个新标签页，地址栏输入127.0.0.1：1123，进入调试页面

