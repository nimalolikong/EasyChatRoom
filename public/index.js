let socket = null;//先不初始化socket,挂空指针
const loginEl = document.querySelector('#login');//登录按钮实例
const friendlistEl = document.querySelector('#friend-list');//获取朋友列表实例
const chatroomEl = document.querySelector('#chatroom');//聊天框主体实例
const windowEl = document.querySelector('#window');//登录框主体实例
const ONLINE = true;//online状态布尔值为true
const OFFLINE = false;//offline状态布尔值为false


let usersLocalInfo =[];//准备好本地用户信息存储(存储全部用户信息)
let userlocalname = null;//存储本地用户名
let selectedFriend = '群聊';//存储选择的朋友，默认为群聊
let userlocalinfo = {};//只存储登录用户一个人的全部信息（为usersLocalInfo数组的一个元素）
let selectedChatroom = null;//存储选择聊天房间，默认选择房间为无（即默认为群聊房间）


//登录成功后进行socket实例化等操作
function login(){ 
    const usernameEl = document.querySelector('#username');
    const passwordEl = document.querySelector('#password');
    
    var username = usernameEl.value;
    var password = passwordEl.value;
    //初始化socket,并写入相关用户信息在连接成功时传给服务端
     socket = io({
         query:{
             name:username,
             password:password,
         },
         reconnection: false,
     }); 

  // 异常登录分析
   socket.on('connect_error',(err)=>{//connect_error是socket.io自带的用于返回错误值的事件
    if(err){
    if(err.message === 'INVALID_USERNAME'){
        alert('不存在该用户，请重试');
        return;
    }
    if(err.message === 'INVALID_PASSWORD'){
        alert('密码错误，请重试');
        return;
    }
 };
    alert('连接失败，请检查websocket服务端');
 });
// 登录成功
 socket.on('connect', () => {
    window.localStorage.setItem('username', username);//实现本地username存储
    window.localStorage.setItem('password', password);
    //存储登录用户名
    userlocalname = username;
    

    //登录用户加入对应房间，实现单聊功能
    switch (username) {
      case '永梦':
        socket.emit('room1');
        socket.emit('room2');
        socket.emit('room3');
        break;
      case '飞羽真':
        socket.emit('room1');
        socket.emit('room4');
        socket.emit('room5');
        break;
      case '阿尊':
        socket.emit('room2');
        socket.emit('room4');
        socket.emit('room6');
        break;
      case '介人':
        socket.emit('room3');
        socket.emit('room5');
        socket.emit('room6');
        break;
    
      default:
        break;
    }
    alert('登录成功');

    //展示聊天界面
    showChatRoom();
   //获取其他用户信息，利用fetch语句通过HTTP GET 请求，注意fetch得到的是http的json的字符串报文，需要转换成json对象，使用.json()函数
   
    fetch('/usersInfo').then(res => res.json()).then((usersInfo) => {//所有用户信息
      
    //根据在线用户列表来判断每个列表项状态
      usersLocalInfo = usersInfo;
      console.log('localusersInfo:',usersLocalInfo);
    //找到本地登录用户所对应的信息
      usersLocalInfo.forEach(user=>{
        if(user.username===username)
        {userlocalinfo = user;
        console.log('the logged user local info',userlocalinfo);
        };
      });
    
    //   usersLocalInfo.forEach(userinfo => {    //依次对每个用户信息进行判断   //为实现在线用户列表状态更新已修改
    //     if(userinfo.username !== username) {   // 不渲染自己
    //     console.log('otherUsers',userinfo.username);
    //     renderFriend(userinfo); //依次渲染朋友列表项           
    //   }
    // });
  });  


  //默认渲染群聊消息
    renderFriendInfo(selectedFriend);
    renderGroupMessage();
      
  //获取在线用户并立刻并更新用户状态 ，防止状态更新慢 
    fetch('/onlineusers').then(res => res.json()).then((onlineusers)=>{
      console.log('onlineusers:', onlineusers);
      updateOnlineUserNumber(onlineusers);

      updateUserstate(onlineusers);
     });
  });
  socket.on('disconnect',()=>{});

  //监听online事件实现用户列表状态更新
  socket.on('online',(onlineusers)=>{
    console.log('online users:',onlineusers);
    
    updateOnlineUserNumber(onlineusers);


    updateUserstate(onlineusers);

  });

  //监听群聊消息
  socket.on('receiveMessageFromGroup',(message) =>{
    console.log('receive group broadcast message:',message);
    if(selectedFriend === '群聊')
    {addNewMessage(message);};
    
  });
//监听对应房间的消息
  socket.on('receiveMessageFromRoom1',(message)=>{
    console.log('receive room1 broadcast message:',message);
    if(selectedChatroom === 'room1'){
      addNewMessage(message);
    };
    
   });
   socket.on('receiveMessageFromRoom2',(message)=>{
    console.log('receive room2 broadcast message:',message);
    if(selectedChatroom === 'room2'){
      addNewMessage(message);
    };
    
   });
   socket.on('receiveMessageFromRoom3',(message)=>{
    console.log('receive room3 broadcast message:',message);
    if(selectedChatroom === 'room3'){
      addNewMessage(message);
    };
    
   });
   socket.on('receiveMessageFromRoom4',(message)=>{
    console.log('receive room4 broadcast message:',message);
    if(selectedChatroom === 'room4'){
      addNewMessage(message);
    };
    
   });
   socket.on('receiveMessageFromRoom5',(message)=>{
    console.log('receive room5 broadcast message:',message);
    if(selectedChatroom === 'room5'){
      addNewMessage(message);
    };
    
   });
   socket.on('receiveMessageFromRoom6',(message)=>{
    console.log('receive room6 broadcast message:',message);
    if(selectedChatroom === 'room6'){
      addNewMessage(message);
    };
    
   });

 };



//点击登录按钮实现登录
loginEl.addEventListener('click',function(){
    login();
});


//渲染朋友列表
function renderFriend(userinfo){
  
    const liEl = document.createElement('li'); 
    const userinfoEl = document.createElement('div');
    const userstateEl = document.createElement('div');
    userinfoEl.innerText = userinfo.username;
    userinfoEl.classList.add("contact-list-content");//直接装两个div定长盒子可以保证相对位置不受flex性质影响，直接写文本不好控制
    userstateEl.classList.add("contact-state");//但是人名过长依旧有被撑开而不是省略的情况

    if(userinfo.state === ONLINE){
      userstateEl.style.backgroundColor = "#00FF00";
    };
    liEl.classList.add('contact-item'); //添加类名
    liEl.append(userinfoEl,userstateEl);//装入两个子元素盒子
    friendlistEl.appendChild(liEl);
    liEl.addEventListener('click',function(){
      selectedFriend = liEl.innerText;
      console.log('the chosed friend',selectedFriend);
      renderFriendInfo(selectedFriend);
      renderFriendMsg(selectedFriend);
    });



}



//更新用户状态
function updateUserstate(onlineusers){

  friendlistEl.innerHTML = '';//清空朋友列表
  usersLocalInfo.forEach((userinfo)=>{//两次遍历，找到本地用户信息中的用户列表在线部分，更新对应的状态值
    onlineusers.forEach((onlineuser)=>{
      console.log('online user:',onlineuser);
      if(userinfo.username === onlineuser){
        userinfo.state = ONLINE;
        };
    });
    if(userinfo.username !== userlocalname){//每次更新状态重新渲染朋友列表
      renderFriend(userinfo)};
       });
  };
  
  // 实现用户状态更新 //已修改为更优方法
  // usersEl.forEach((user) => {//对每个用户列表项遍历
  //   let userinfoEl = user.children[0];//注意.children方法本身是只读的，所以要先定义一个实例与子元素对应再利用这个实例对子元素进行操作，负责报错
  //   let userstateEl = user.children[1];

  //   onlineusers.forEach(onlineuser =>{//对每个在线用户进行遍历
  //     console.log('onlineuser:',onlineuser);
  //     if(userinfoEl.innerText === onlineuser){
  //     state = true;
  //     userstateEl.style.backgroundColor = "#00FF00";//对用户列表项状态值进行更新
  //     console.log('state changed user:',userinfoEl.innerText);
  //     };     
  //   });
  //   if(state === false){
  //   userstateEl.style.backgroundColor = "red";
  //   };
  //  state = false;//防止用户下线时上一个用户在线导致的状态错误
  // });


// //渲染群聊信息  //已统一到朋友消息渲染
// function renderGroupInfo(){
//  const groupinfoEl = document.querySelector('#friend-info');
//  const onlineusersnumberEl = document.querySelector('.online-number');//最好不要创建元素，因为会无法访问，可以采用display:none的方法通过隐藏实现元素新增和消失
 
//  groupinfoEl.innerText = '群聊';
//  fetch('/onlineusers').then(res => res.json()).then((onlineusers)=>{
//   console.log("在线人数",onlineusers.length);
//  onlineusersnumberEl.textContent = onlineusers.length;
//  });

// };

//更新在线人数
function updateOnlineUserNumber(onlineusers){
  document.querySelector('.online-number').textContent = onlineusers.length;
}

//渲染群聊消息
function renderGroupMessage(){
   fetch('/grouphistory').then(res => res.json()).then((grouphistory)=>{
     console.log('the group history:', grouphistory);
     document.querySelector('#friend-info-list').innerHTML = '';//信息列表选择对象清空，防止残留    
     grouphistory.forEach(message =>{
       switchMessageStyle(message);      
     });
    });  
};


//发送群消息
function sendMessageToGroup(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageToGroup',msgContent);
  textEl.value = '';

}
//发送消息到room1
function sendMessageRoom1(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageRoom1',msgContent);
  textEl.value = '';

}
//发送消息到room2
function sendMessageRoom2(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageRoom2',msgContent);
  textEl.value = '';

}
//发送消息到room3
function sendMessageRoom3(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageRoom3',msgContent);
  textEl.value = '';

}
//发送消息到room4
function sendMessageRoom4(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageRoom4',msgContent);
  textEl.value = '';

}
//发送消息到room5
function sendMessageRoom5(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageRoom5',msgContent);
  textEl.value = '';

}

//发送消息到room6
function sendMessageRoom6(){
  const textEl = document.querySelector('#msg-input');
  const msgContent = textEl.value;
  socket.emit('sendMessageRoom6',msgContent);
  textEl.value = '';

}

                                                              

//添加一条新消息,不用频繁访问history
function addNewMessage(message){
  switchMessageStyle(message);
}



//渲染选择的朋友信息（包括群聊）

function renderFriendInfo(selectedFriend){

const friendinfoEl = document.querySelector('#friend-info');
const onlineusersnumberEl = document.querySelector('.online-number');//最好不要创建元素，因为会无法访问，可以采用display:none的方法通过隐藏实现元素新增和消失
friendinfoEl.innerText = '';
 friendinfoEl.innerText = selectedFriend;
 fetch('/onlineusers').then(res => res.json()).then((onlineusers)=>{
  console.log("在线人数",onlineusers.length);
  onlineusersnumberEl.textContent = onlineusers.length;
 });

}





//渲染朋友消息界面
function renderFriendMsg(selectedFriend){
//之前存储的用户本地信息直接调用
userlocalinfo.friendhistory.forEach(friendhistory=>{
  //确定好选择的房间和历史数组
  if(friendhistory.friendname === selectedFriend){
    selectedChatroom = friendhistory.room;
    console.log('the chosed room is:',selectedChatroom);
    fetch(friendhistory.history).then(res=>res.json()).then((history)=>{
      console.log('this room history:', history);
      document.querySelector('#friend-info-list').innerHTML = '';//信息列表选择对象清空，防止残留    
      history.forEach(message =>{
        switchMessageStyle(message);      
      });

    });
  };
});

}


//登录成功，展示聊天界面
function showChatRoom(){
  
  windowEl.classList.add("window-none");
  chatroomEl.classList.add("chatroom-active");
}

//渲染自己的消息（靠右）
function userOwnMessage(history,avatar,friendInfoListEl){
  const bigdivEl = document.createElement('div');
  const infodivEl = document.createElement('div');
  const divEl = document.createElement('div');//大盒子，用来装小盒子和头像
  const div1El = document.createElement('div');//小盒子，聊天信息
  const imgEl = document.createElement('img');//头像
  divEl.classList.add("list-item");//同上，通过添加类名来添加样式
  div1El.classList.add("message");
  imgEl.classList.add("avatar");
  infodivEl.classList.add("right-info-div");
 
  infodivEl.innerText = history.name;
  div1El.innerText = history.content;
  imgEl.src = avatar;
  divEl.append(div1El,imgEl);//将上面两个元素添加近divEl容器
  bigdivEl.append(infodivEl,divEl);//名称盒子也加入
  friendInfoListEl.appendChild(bigdivEl);//将divEl容器添加进信息列表对象
  
};


//渲染其他人的消息（靠左）
function otherUserMessage(history,avatar,friendInfoListEl){
   
  const bigdivEl = document.createElement('div');
  const infodivEl = document.createElement('div');
  const divEl = document.createElement('div');//大盒子，用来装小盒子和头像
  const div1El = document.createElement('div');//小盒子，聊天信息
  const imgEl = document.createElement('img');//头像
  divEl.classList.add("list-item","list-item-right");//添加多类名实现更新样式，减少代码量
  div1El.classList.add("message");
  imgEl.classList.add("avatar");
  infodivEl.classList.add("left-info-div");
  infodivEl.innerText = history.name;
  div1El.innerText=history.content;
  imgEl.src=avatar;
  divEl.append(imgEl,div1El);//注意顺序方向，朋友说话头像应该在前面，和自己说话作出区分
  bigdivEl.append(infodivEl,divEl);//名称盒子也加入
  friendInfoListEl.appendChild(bigdivEl);//将divEl容器添加进信息列表对象
};


//实现不同消息不同渲染方式
function switchMessageStyle(message){
  const friendInfoListEl = document.querySelector('#friend-info-list');//信息列表选择对象
  switch(message.name){

    case '永梦':   if(userlocalname === '永梦'){
     userOwnMessage(message,usersLocalInfo[0].avatar,friendInfoListEl);
    }
    else {
      otherUserMessage(message,usersLocalInfo[0].avatar,friendInfoListEl);
    };
    break;

    case '飞羽真': if(userlocalname === '飞羽真'){
     userOwnMessage(message,usersLocalInfo[1].avatar,friendInfoListEl);
    }
    else {
      otherUserMessage(message,usersLocalInfo[1].avatar,friendInfoListEl);
    };
    break;

    case '阿尊': if(userlocalname === '阿尊'){
     userOwnMessage(message,usersLocalInfo[2].avatar,friendInfoListEl);
    }
    else {
      otherUserMessage(message,usersLocalInfo[2].avatar,friendInfoListEl);
    };
    break;

    case '介人': if(userlocalname === '介人'){
     userOwnMessage(message,usersLocalInfo[3].avatar,friendInfoListEl);
    }
    else {
      otherUserMessage(message,usersLocalInfo[3].avatar,friendInfoListEl);
    };
    break;

    default: break;
  }
}

//不同房间消息发送到对应房间

function switchSendroom(selectedChatroom){
  switch (selectedChatroom) {
    case 'room1':
      sendMessageRoom1();
      break;
    case 'room1':
      sendMessageRoom1();
      break;
    case 'room2':
      sendMessageRoom2();
      break;
    case 'room3':
      sendMessageRoom3();
      break;
    case 'room4':
      sendMessageRoom4();
      break;
    case 'room5':
      sendMessageRoom5();
      break;
    case 'room6':
      sendMessageRoom6();
      break;
    default:
      break;
  }
}

//实现点击发送键发送信息
document.querySelector('#btn-send').addEventListener('click',function(){
  if(selectedFriend === '群聊')
    {sendMessageToGroup();}
    else {switchSendroom(selectedChatroom);}
                                                                
}); 


//实现enter完成输入
document.onkeydown = function (event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if (e && e.keyCode == 13) { // enter 键
    if(selectedFriend === '群聊')
    {sendMessageToGroup();}
    else {switchSendroom(selectedChatroom);}


  }
};


//添加"群聊"的addeventlistener实现点击切换聊天界面
document.querySelector('#group').addEventListener('click',function(){
  selectedFriend = '群聊';
  selectedChatroom = null;
  console.log('the chosed room:',selectedFriend);
  renderFriendInfo(selectedFriend);
  renderGroupMessage();
});