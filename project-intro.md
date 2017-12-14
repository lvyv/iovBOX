# 一、背景 #
## 1.改变世界的机器 ##
1999年夏天一个空气清新的早晨，我们站在长安集团技术中心窗前，窗外楼下的广场上整齐的停放着一排排的新出厂的微型车，气势磅礴。
也就是那一年，我们读到《改变世界的机器》这本书，该书作者将人类迄今最大的制造业图景缓缓展现在我们的面前——工业中的工业在转化，汽车工业对我们来说，要比乍看起来更为重要。
汽车是流淌着马车基因、蕴含着人类科技结晶的钢铁怪侠，它改变了我们的生存方式和价值观念，成为动力与时尚、驾驭与征服的代表。从发明到发展，它凝聚了无数人的智慧与创新。作为改变世界的机器，汽车实现人类自由行走的亘古梦想，使全球工业文明如虎添翼，更成为人类改造自然的强大助手。
## 2.专用车联网 ##
2017年秋天这个周六的下午，我们在7楼办公室谈论这电动汽车，构思着公司的未来。我们坚信蓬勃发展的信息技术将赋予这钢铁怪侠以灵魂，并将此作为我们的责任。我们把自己的目标锁定在专用车联网领域并给专用车了如下的定义：装置有专用设备，具备专用功能，用于承担专项作业任务、专门运输任务以及其他专项用途的汽车和可行走机械。我们所瞄准的第一类专用车是驾校的考试训练车，在这之后，我们将走向田野、工地、机场、港口，把农机、建机、引导车、牵引车、……当成我们的新目标。这是一个广阔的天地，我们要让这些专用车辆更加“聪明”的运作。
## 3.感知时空、对话万物 ##
三年前，我们选择了一个特殊的专用车领域：驾校的培训车辆作为我们事业的开始。怎么才能让一部驾校训练车辆教会一个没有驾驶经验的人类驾驶技能呢？我们研究了两个关键的技术：让车“感知”高精度的时空，让车“对话”这世上的万物。
# 4.对专用车联网我们的一些共识 #
共识一：
专用车涉及不同的业务应用领域，而车联网终端作为信息设备，必须要和业务应用领域深度融合，切实为专用车的使用客户带来生产力的提升，才能让车联网终端成为刚需。这是我们提出的为“车联网终端赋予灵魂”这个说法的含义。
共识二：
只有长时间浸淫专业应用领域的人或公司与车联网底层复杂且共性的关键信息技术深度融合才能提出有助于生产力提升专用车联网系统解决方案。能否寻找到某业务应用领域的人和团队合作共赢，是在某个专用车联网领域获得成功的关键。这是我们提出的“借船出海”这个说法的含义。
共识三：
进入某个业务应用领域，不可避免的会出现反复的用户化定制工作。如果把有限的技术和市场资源投入的无限的用户化定制工作，将导致车联网业务无法实现快速规模化增长。我们必须抽取车载计算关键共性的技术，提炼出标准化的计算平台。这个计算平台的硬件形态应该类似比尔盖茨眼中每个书房中的PC，乔布斯眼中每个口袋中的智能手机。只有这样一个**适合于车辆这个特殊计算环境的，稳定可靠的，并且二次开发门槛较低的**标准软硬件平台的出现，才能促进每台专用汽车中的可定制业务应用二次开发的繁荣。这就是我们提出的“产品标准化”的含义。
# 二、钢铁怪侠的灵魂 #
灵魂需要实体的支撑，我们认为未来的车辆上一定会出现一个类似路由器这样的终端产品。它能够提供互联网接入功能，并能车载总线和各类车载设备和传感器，并具有较强的计算处理能力。我们称其为iovBOX。
## 1.iovBOX的基础功能 ##
a)对接不同的网络平台，实现不同厂家车联网终端与平台的通信协议。

b)联接不同的车载配件设备，对接和实现其接口及私有协议。

c)能采用高级语言实现较复杂的规则逻辑处理。

d)本地提供人机交互的接口方法：比如语音支持和显示。

## 2.iovBOX的高级功能 ##
a)感知类：视频分析、MEMS传感、超声波、毫米波、红外等。

b)控制类：智能控制、人工智能
## 3.小结 ##
**第一、车联网终端产品的基础功能可以简化为两大类。它们可以通过JS的脚本语言去实现。**

1.不同来源的数据采集、解析、转发功能。
举例。
功能点A：1）从串口（数传电台）获取差分服务；2）把差分数据通过网口提供给高精度定位模块；3）通过高精度定位模块从网络获得高精度定位数据；4）把高精度定位数据通过wifi网络发送给车载平板。
功能点B：1）根据差分服务异常，则闪烁指示灯1#；2）高精度定位数据固定解失败，则闪烁2#。
功能点C：1）采集轨迹点；2）按指定的要求发送回特定的后台服务。
功能点D：1）采集车载CAN总线数据；2）解析特定CAN ID；3）根据CAN ID进行各种业务逻辑处理；4）按业务应用需求把车辆状态数据融合并发送给特定的后台服务，或响应后台服务请求，通过CAN实现控制操作。

2.对终端盒子的远程管理功能，主要为BOSS远端的升级、配置等指令响应。
针对js的这个问题，主要要解决的是异步的js，怎么能够包含不同的模块呢。可以参考雷神的做法，如下。


**第二、车联网终端的高级功能则包含了视频、智能等本地边缘计算功能。这些功能可通过NodeJS的本地C库来实现。**



# Where Do We Come From? What Are We? Where Are We Going? #
## 1. The machine that changed the world  ##
In the summer of 1999, with a fresh air in the morning, we stood in front of the Changan Group Technology Center. There were rows of newly-built mini cars, neatly parked on the square below the window, magnificent.
That year, when we read the book, The Machine That Changed the World, which presented the world's biggest manufacturing picture of mankind to us slowly - the transformation of industry in industry and the transformation of the automobile industry to us That's more important than it seems at first glance.
Cars are shedding carriage genes, containing the crystallization of human science and technology iron strange man, it has changed our way of life and values, as the representative of power and fashion, control and conquest. From invention to development, it brings together the wisdom and innovation of countless people. As a machine for changing the world, the car's everlasting dream of free walking of mankind has made the world's industrial civilization even more powerful and become a powerful aide to mankind's transformation of nature.
## 2. Intelligent network of special purpose vehicles ##
In the autumn of 2017, this Saturday afternoon, we talked about this electric car on the 7th floor office and conceived the future of the company. We firmly believe that thriving information technology will give this Iron Man a soul and take it as our responsibility. We have our own target locked in the field of private car networking and to the definition of special vehicles as follows: The device has a dedicated equipment, with special features, for undertaking special operations tasks, special transport missions and other special purpose vehicles and mobile machinery. The first type of special vehicle we are targeting is a driving test training vehicle. After that, we will move to the fields, construction sites, airports and seaports and regard our agricultural machinery, construction machinery, pilot vehicles and tractor vehicles as our new target . This is a vast world. We want to make these special purpose vehicles more "smart" operations.
## 3. Perception of space and time, ablility of dialogue with things  ##
How to make a driving school training vehicle church a human driving skills without driving experience? We studied two key technologies: let the car "feel" high-precision space-time information, let the car "dialogue" with in this world.
## 4. ET BOX, soul of the vehicle ##
How to make a driving school training vehicle church a human driving skills 
![](http://a1.qpic.cn/psb?/20d33643-6729-4508-90f7-3e6c4dea7187/AEE4o0cdOkBvrZ.S7kUF.NIE2NLa.THHL4Juafk1XUg!/b/dOAAAAAAAAAA&ek=1&kp=1&pt=0&su=0110831745&tm=1509904800&sce=0-12-12&rf=2-9)

![](http://a3.qpic.cn/psb?/20d33643-6729-4508-90f7-3e6c4dea7187/euU1f5GzCqtT2tj4hH6CG3KEZeplZPPgpD8bSswYr.M!/b/dG4AAAAAAAAA&ek=1&kp=1&pt=0&su=083317297&tm=1509904800&sce=0-12-12&rf=2-9)


