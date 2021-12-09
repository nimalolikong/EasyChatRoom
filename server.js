const path = require('path');
const http = require('http');
const Koa = require('koa');
const serve = require('koa-static');
const socketIO = require('socket.io');

//地址名，这里默认为127.0.0.1 可以自己更改为对应的地址名
const hostname = '127.0.0.1';
const port = 4000;
const publicPath = path.join(__dirname, 'public');

// 创建 koa 实例
const app = new Koa();
// 创建 http server 实例
const server = http.createServer(app.callback());
// 创建 socket.io 实例
const io = socketIO(server);

//在线状态常量

const OFFLINE = false;
const usersInfo = [{
    username: '永梦',
    password:'123456',
    avatar:'yongmeng.png',
    state: OFFLINE,//默认在线状态为离线
    friendhistory:[
    {friendname:'飞羽真',
     history:'/history1',
     room:'room1'      
    },
    {friendname:'阿尊',
    history:'/history2',
    room:'room2'       
    },
    {friendname:'介人',
    history:'/history3',
    room:'room3'      
    }
  ],

},
{
    username:'飞羽真',
    password:'123456',
    avatar:'feiyuzhen.jpg',
    state: OFFLINE,
    friendhistory:[
      {friendname:'永梦',
       history:'/history1', 
       room:'room1'      
      },
      {friendname:'阿尊',
      history:'/history4' ,
      room:'room4'      
      },
      {friendname:'介人',
      history:'/history5',
      room:'room5'       
      }
    ],
},
{
    username:'阿尊',
    password:'123456',
    avatar:'azun.jpg',
    state: OFFLINE,
    friendhistory:[
      {friendname:'永梦',
       history:'/history2',
       room:'room2'       
      },
      {friendname:'飞羽真',
      history:'/history4' ,
      room:'room4'      
      },
      {friendname:'介人',
      history:'/history6',
      room:'room6'       
      }
    ],
},
{
    username:'介人',
    password:'123456',
    avatar:'jieren.jpg',
    state: OFFLINE,
    friendhistory:[
      {friendname:'永梦',
       history:'/history3',
       room:'room3'       
      },
      {friendname:'飞羽真',
      history:'/history5'  ,
      room:'room5'     
      },
      {friendname:'阿尊',
      history:'/history6' ,
      room:'room6'      
      }
    ],
}
];

//登录认证
io.use((socket,next)=>{
    let validname = false;//标志，为了判断用户名是否有效
    let validpassword = false;
    const { name, password } = socket.handshake.query;
   usersInfo.forEach(user => {
        if(name === user.username){
            validname = true;
            if(password !== user.password){
                validpassword = true;
                console.log('密码错误');
                return next(new Error ('INVALID_PASSWORD'));}
            
             next ();
            }
    });
   if(!validname&&!validname) {console.log('无效用户名');
    return next(new Error('INVALID_USERNAME')); }
    
    
    
});


// 存储所有在线用户
const onlineusers = new Map();
// 存储群组历史消息
const grouphistory = [];
// 存储永梦，飞羽真历史消息
const history1 = [];
// 存储永梦，阿尊历史消息
const history2 = [];
// 存储永梦，介人历史消息
const history3 = [];
// 存储飞羽真，阿尊历史消息
const history4 = [];
// 存储飞羽真，介人历史消息
const history5 = [];
// 存储阿尊，介人历史消息
const history6 = [];



// 客户端连入
io.on('connection', (socket) => {
  // 记录用户
  const name = socket.handshake.query.name;
  onlineusers.set(name, socket);

  console.log(`${name} connected`);


  //加入房间1-6实现分组传输
  socket.on('room1',()=>{
    socket.join('room1');
  });
  socket.on('room2',()=>{
    socket.join('room2');
  });
  socket.on('room3',()=>{
    socket.join('room3');
  });
  socket.on('room4',()=>{
    socket.join('room4');
  });
  socket.on('room5',()=>{
    socket.join('room5');
  });
  socket.on('room6',()=>{
    socket.join('room6');
  });

  // 通知所有客户端更新聊天列表
  io.sockets.emit('online', [...onlineusers.keys()]);

  // 监听客户端发送的群发消息
  socket.on('sendMessageToGroup', (content) => {
    console.log(`${name} send a message to group: ${content}`);
    const message = {
      name: name,
      content: content,
    };
    // 记录消息
    grouphistory.push(message);
    // 向所有客户端广播这条消息
    io.sockets.emit('receiveMessageFromGroup', message);
  });

    // 监听客户端发送的群发消息
    socket.on('sendMessageRoom1', (content) => {
      console.log(`${name} send a message to room1: ${content}`);
      const message = {
        name: name,
        content: content,
      };
      // 记录消息
     history1.push(message);
      // 向所有客户端广播这条消息
      io.sockets.in('room1').emit('receiveMessageFromRoom1', message);
    });


      // 监听客户端发送的群发消息
  socket.on('sendMessageRoom2', (content) => {
    console.log(`${name} send a message to room2: ${content}`);
    const message = {
      name: name,
      content: content,
    };
    // 记录消息
    history2.push(message);
    // 向所有客户端广播这条消息
    io.sockets.in('room2').emit('receiveMessageFromRoom2', message);
  });


    // 监听客户端发送的群发消息
    socket.on('sendMessageRoom3', (content) => {
      console.log(`${name} send a message to room3: ${content}`);
      const message = {
        name: name,
        content: content,
      };
      // 记录消息
     history3.push(message);
      // 向所有客户端广播这条消息
      io.sockets.in('room3').emit('receiveMessageFromRoom3', message);
    });


      // 监听客户端发送的群发消息
  socket.on('sendMessageRoom4', (content) => {
    console.log(`${name} send a message to room4: ${content}`);
    const message = {
      name: name,
      content: content,
    };
    // 记录消息
    history4.push(message);
    // 向所有客户端广播这条消息
    io.sockets.in('room4').emit('receiveMessageFromRoom4', message);
  });


    // 监听客户端发送的群发消息
    socket.on('sendMessageRoom5', (content) => {
      console.log(`${name} send a message to room5: ${content}`);
      const message = {
        name: name,
        content: content,
      };
      // 记录消息
      history5.push(message);
      // 向所有客户端广播这条消息
      io.sockets.in('room5').emit('receiveMessageFromRoom5', message);
    });

      // 监听客户端发送的群发消息
  socket.on('sendMessageRoom6', (content) => {
    console.log(`${name} send a message to room6: ${content}`);
    const message = {
      name: name,
      content: content,
    };
    // 记录消息
    history6.push(message);
    // 向所有客户端广播这条消息
    io.sockets.in('room6').emit('receiveMessageFromRoom6', message);
  });



  // 客户端断开连接
  socket.on('disconnect', (reason) => {
    console.log(`${name} disconnected, reason: ${reason}`);
    onlineusers.delete(name);
    // 通知所有客户端更新聊天列表
    io.sockets.in('room1').emit('online', [...onlineusers.keys()]);
  });

});



// 静态资源路由
app.use(serve(publicPath));

// 获取所有历史记录和用户信息的 HTTP 接口
//利用koa创建中间件，对ctx对象中body进行赋值，这里的body是http协议体中的响应体
app.use((ctx) => {
  if (ctx.request.path === '/grouphistory') {
    ctx.body = grouphistory;
  };
  if (ctx.request.path === '/history1') {
    ctx.body = history1;
  };
  if (ctx.request.path === '/history2') {
    ctx.body = history2;
  };
  if (ctx.request.path === '/history3') {
    ctx.body = history3;
  };
  if (ctx.request.path === '/history4') {
    ctx.body = history4;
  };
  if (ctx.request.path === '/history5') {
    ctx.body = history5;
  };
  if (ctx.request.path === '/history6') {
    ctx.body = history6;
  };
  if(ctx.request.path === '/usersInfo'){
    ctx.body = usersInfo;
  };
  if(ctx.request.path === '/onlineusers'){
    ctx.body = [...onlineusers.keys()];//解决最后一个登录者在线用户状态错误，登录者自己的online行为没有监听到所导致，提前获取状态并更新
  }
});


//监听连接地址和端口
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});