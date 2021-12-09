//登录界面
const loginEl = document.querySelector('#login');
const windowEl = document.querySelector('#window');
const chatroomEl = document.querySelector('#chatroom');

function doLogin(){

    const usernameEl = document.querySelector('#username');
    const passwordEl = document.querySelector('#password');

    const username = usernameEl.value;
    const password = passwordEl.value;
    if(username==='admin'&&password==='123456'){
        alert("登录成功");
      windowEl.style.display = "none";
      chatroomEl.style.display = "flex";
      
       }
    else{
        alert("登陆失败");
       
    }
}
loginEl.addEventListener('click',function(){
   doLogin();
   
  
});


chatroomEl.style.display = "none";


//主界面


//定义聊天信息对象
const charInfo = {
    userInfo: {
        nickName: '飞羽真'
    },
    //朋友列表对象，每个朋友应该有对应的对谈列表信息
    friends: [

        {
        friendInfo: {
            nickName: '永梦' 
        } ,
        infoList: [
            {nickName:'永梦',avatar:"yongmeng.jpg",content:'十圣刃牛逼啊',isMine:false},
            {nickName:'飞羽真',avatar:"feiyuzhen.png",content:'你无敌不强吗',isMine:true},
            {nickName:'永梦',avatar:"yongmeng.jpg",content:'彼此彼此',isMine:false}
        ]
    },
    
    {
        friendInfo: {
            nickName: '阿尊' 
        } ,
        infoList: [
            {nickName:'阿尊',avatar:"azun.png",content:'收了个好尾啊，厉害',isMine:false},
            {nickName:'飞羽真',avatar:"feiyuzhen.png",content:'诚哥外传也行啊前辈',isMine:true},
            {nickName:'阿尊',avatar:"azun.png",content:'哈哈，做好自己就行，别在乎太多外界评价啊',isMine:false}
        ]
    },

    {
        friendInfo: {
            nickName: '介人' 
        } ,
        infoList: [
            {nickName:'介人',avatar:"jieren.jpg",content:'兄弟牛逼',isMine:false},
            {nickName:'飞羽真',avatar:"feiyuzhen.png",content:'你也快完结了，加油啊，好好整活！',isMine:true},
            {nickName:'介人',avatar:"jieren.jpg",content:'那必须的，那肯定得给整上',isMine:false}
        ]
    }
]
};
//渲染好友列表
let selectedFriend = charInfo.friends[0];//设置默认朋友，并且设为全局变量实现参数传入


function renderFriendList(){
  const friendListEl = document.querySelector('#friend-list');
  
  //selectFriend(selectedFriend);//初始默认朋友的相关信息
  charInfo.friends.forEach(friend =>{//foreach方法，遍历friend数组
  
  const liEl = document.createElement('li');
  
  liEl.innerHTML = `<div class= "contact-list-content" id = "contact-list-content">${friend.friendInfo.nickName}</div><div class="contact-state"></div>`;
  liEl.classList.add("contact-item");//添加类方法名
  
  
  friendListEl.appendChild(liEl);
  liEl.addEventListener('click',function(){
     selectFriend(friend);
  })
  }
  );

}

//选择单个好友进行聊天
function selectFriend(friend){
selectedFriend = friend;//这里的selectedFriend是在上级的全局
renderFriendInfo();
renderInfoList();
}
//渲染好友信息
function renderFriendInfo( ){
const friendInfoEl = document.querySelectorAll('#friend-info');
friendInfoEl.forEach(element => {
    element.innerText = selectedFriend.friendInfo.nickName; 
});
}


//渲染聊天信息 
function renderInfoList( ){
const friendInfoListEl = document.querySelector('#friend-info-list');//信息列表选择对象
friendInfoListEl.innerHTML = '';//清空，防止残留
const infoListEl = selectedFriend.infoList;//选中朋友的信息列表
infoListEl.forEach(msgInfo=>{

const divEl = document.createElement('div');//大盒子，用来装小盒子和头像
const div1El = document.createElement('div');//小盒子，聊天信息
const imgEl = document.createElement('img');//头像
const bigdivEl = document.createElement('div');
const infodivEl = document.createElement('div');
if(msgInfo.isMine===true){//判断是否为自己的消息
divEl.classList.add("list-item");//同上，通过添加类名来添加样式
div1El.classList.add("message");
imgEl.classList.add("avatar");
infodivEl.classList.add("right-info-div");

div1El. innerText = msgInfo.content;//输入聊天信息
infodivEl.innerText = msgInfo.nickName;
imgEl.src = msgInfo.avatar;//输入头像地址
divEl.append(div1El,imgEl);//将上面两个元素添加近divEl容器
bigdivEl.append(infodivEl,divEl);
friendInfoListEl.appendChild(bigdivEl);//将divEl容器添加进信息列表对象
}

else{//不是自己消息的情况，情况类似自己的消息
divEl.classList.add("list-item","list-item-right");//添加多类名实现更新样式，减少代码量
div1El.classList.add("message");
imgEl.classList.add("avatar");
infodivEl.classList.add("left-info-div");
div1El. innerText =msgInfo.content;
infodivEl.innerText = msgInfo.nickName;
imgEl.src = msgInfo.avatar;
divEl.append(imgEl,div1El);//注意顺序方向，朋友说话头像应该在前面，和自己说话作出区分
bigdivEl.append(infodivEl,divEl);
friendInfoListEl.appendChild(bigdivEl);
}

});
}



renderFriendList();//要先渲染才有界面
//发送信息
function sendMessage(){
    const textEl = document.querySelector('#msg-input');
    const msgContent = textEl.value;
   
    selectedFriend.infoList.push(
        {nickName:'飞羽真',avatar:"feiyuzhen.png",content: msgContent ,isMine:true}
    )
    
    textEl.value ='';
    renderInfoList();//更新列表
}


document.querySelector('#btn-send').addEventListener('click',function(){//注意addEventListener不主动移除的话会按照语句加载次数实行操作，
    sendMessage();                                                                  //所以应该放在最外层而不是循环内部，
}                                                     //如果想要溢出addeventlistener可以使用removeeventlistener
);
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) { // enter 键
        sendMessage();
    }
  };
