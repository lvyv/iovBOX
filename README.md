项目简介
==
iovBOX设备（以下简称iovBOX）按工业级产品严酷应用环境而设计，适合专用车联网系统的车端嵌入式应用二次开发，iovBOX也能用于工业自动化领域的特色应用定制开发.<br>
iovBOX内置了JS引擎库的支持，可以使用JavaScript开发应用程序，对iovBOX进行操作。<br>
iovBOX支持JavaScript应用程序基于DBUS服务访问小数据量的硬件接口，也支持通过JavaScript的标准接口访问大数据量的网络、RS485和CAN总线接口。<br>
而该项目就是针对iovBOX进行开发的JS接口以及示例项目。

开发工具
==
开发工具推荐使用Visual Studio Code，有完整的插件支持，同时也支持远程调试iovBOX应用程序的JavaScript代码。

文件夹简介
==
demo：示例代码，目前提供了视频/gps/gpio/蓝牙/CAN/485/等等iovBOX支持的硬件调用示例。<br>
dbus：iovBOX的dbus服务的JS接口，根据iovBOX以及应用的要求更新。<br>
doc：开发接口，开发手册，调试方式等等文档。<br>
src：开发中的iovSRV代码。<br>
test：测试用例。<br>

