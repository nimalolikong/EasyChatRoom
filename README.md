# EasyChatRoom
一个简单的通过node.js、koa和socket.io 实现的多人和单人的聊天室

本项目需要在上述环境下才能运行，使用前请注意npm.init创建package.json调用包使用的包的版本为

> ![image](https://user-images.githubusercontent.com/79907815/145404483-1a11db56-b673-40c7-8b1c-90e6205ae2cd.png)

本项目是参加成电和蚂蚁前端合作在2021年秋天开设的一次为期两个周末前端课程中完成的大作业  
中间踩了很多坑，最后还是花了四天完成了大概的要求
> 用户名定死为 *永梦，飞羽真，阿尊，介人* 密码为 *123456*  
没有注册系统，没有数据库，原生js，没有用vue,jquery等框架，后期看情况是否更新

本项目可以分为五个部分  
1. 登录界面设计  
2. 聊天界面设计
3. 登录逻辑设计
4. 多聊逻辑设计
5. 单聊逻辑设计  
  
其中界面设计不多做赘述，可以按照自己喜欢的样式设计  
这里我大致沿用老师上课讲的设计思路，得到的界面如下  
> #### 登录界面  
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/登录界面.png" width="400px">  

> #### 聊天界面  
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/聊天界面.png" width="400px">  

接下来就是本项目的核心内容，*利用node.js、koa框架和socket.io框架搭建小全栈聊天室*  

关于node.js的安装，配置，npm的使用，安装koa包、koa-static包和socket.io包的过程这里略去不谈，需要了解可以自行查阅  
聊天室的登录逻辑实现和大部分socket.io的简易聊天室类似，通过客户端和服务端监听对应登录事件做出对应操作完成  
这里我是根据老师的思路，在登录成功后才进行客户端io实例的创建（在此之前置空）这样服务端就可对整个登录过程实现监控和认证管理
这里通过 *socket.handshake* 方法实现客户端和服务端登录交互，具体可见对应代码  

对于登录状态可以分为三种
1. 登录成功  
2. 登录失败
   * 不存在该用户  
   * 密码错误
3. 连接失败  
对应逻辑实现可以查看对应部分代码，对应状态会弹出对应的alert窗口  
接着就是渲染朋友列表，这里默认第一个是群聊，同时对于每个用户朋友列表是不同的，登录状态也不相同  
所以渲染时也需要客户端和服务端实例特定监听事件实现对在线用户的存储和管理  
实现成功后就能得到渲染好的朋友列表该列表状态随登录用户数量的变化，登录用户的不同而变化  
> ####  登录用户为介人，在线人数为三人  
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/聊天列表1.png" width="400px">   

> ####  登录用户为永梦，在线人数为两人  
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/聊天列表2.png" width="400px">   

这里需要注意的是，我将所有用户信息都提前存储在了服务端这边，客户端每次访问时会在客户端本地进行一个备份，方便接下来的一堆操作  
最后就是消息渲染，群聊消息很好实现，单聊主要是需要使用分组方法让用户加入对应分组，服务端只向对应分组发消息  
服务端语句  
```  
//服务端监听入组事件实现用户分组
io.sockets.on('connection', function (socket) {
  socket.on('firefox', function (data) {
    socket.join('firefox');
  });
  socket.on('chrome',function(data){
    socket.join('chrome');
  });
});
//分组发送信息（向组内所有人发送）
io.socket.in('chrome').emit('event_name',data);
```
客户端语句  
```
//加入对应分组
socket.emit('firefox');
socket.emit('chrome');
```
这里只需要在建立独立的*history[]* 数组实现分组存储就实现了单聊，具体实现过程可见*server.js* 和*index.js* 文件的代码注释
最后的项目成果展现如下
> #### 登录成功
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/登录成功.png" width="400px">   

> #### 登录失败
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/登录失败.png" width="400px">   

> #### 群聊
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/群聊.png" width="400px">   

> #### 单聊1
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/单聊1.png" width="400px">   

> #### 单聊2
> <img src="https://github.com/nimalolikong/EasyChatRoom/blob/main/images/单聊2.png" width="400px">   



> ## 一些个人记录  
> 这是本人第一个独立完成的项目，虽然简单，但是也实现了对应需求，我还是很满意的  
> 但是整个完成过程还是很痛苦，有些玄学错误我都没法理解，出现了什么复制代码出错手写代码出问题  
> 或者自己写的代码出错，老师写的一模一样的代码就可以，这导致我一开始根本没法在客户端创建io实例  
> 但是最后还是全部推翻重来后成功运行了，这让我深刻体会到前端的玄学性，真就只能肉身踩坑才能进步  
> 这个项目实现得很粗糙，也没用到数据库，也没用到数据加密，后端也只是利用了node.js距离一个真正的全栈项目还差很远  
> 从实现登陆逻辑，朋友列表渲染，列表状态更新，群聊消息渲染，单聊消息实现，每一步都对我来讲存在着挑战  
> 但是我真的学到了很多，比如*children* 方法是只读的，要访问要创建对应实例等等，都是收获  
> 如果有人看完这些唠叨的话，我会十分感谢  
> 该复习期末了  






