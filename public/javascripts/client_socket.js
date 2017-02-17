// 客户端
var chat_server = 'http://' + location.hostname + ':3000';
var socket = io.connect(chat_server);
// console.log('server: ' + chat_server);
var nicknameList=[];


$(window).keydown(function (e) {
	if (e.keyCode == 116) {
		// if (!confirm("刷新将会清除所有聊天记录，确定要刷新么？")) {
  	// 	e.preventDefault();
		// }
	}
});

if(sessionStorage.getItem('nickname')==null)
{
	$(".login").show();
}
else{
	$(".allChat").show();
	socket.emit('nickname',sessionStorage.getItem('nickname'));
	$(".leftChat .myNickname").html("昵称："+sessionStorage.getItem('nickname'));
}

function press(e) {
	e.preventDefault();
	if(e.keyCode == 13) {
		check();
	}
}

$("#nickname").keydown(function(e) {
	if(e.keyCode == 13) {
		check();
	}
})

function check(){
	var nickname=$("#nickname");
	var name = $("#nickname").val();
	var errorNickname=$(".errorNickname");
	var name_len = name.length;
	if ("" == name) {
    errorNickname.text("请填写昵称");
    errorNickname.show();
    nickname.focus();
  }
  else if (name_len < 4 || name_len > 16) {
    errorNickname.text("请填写正确的昵称，应为4到16个字符");
    errorNickname.show();
  }
  else if(nicknameList.indexOf(name)>-1){
  	errorNickname.text("用户名已存在");
    errorNickname.show();
    nickname.focus();
  }
  else{
  	socket.emit('nickname',$("#nickname").val());
  	sessionStorage.setItem('nickname',$("#nickname").val());
		$(".leftChat .myNickname").html("昵称："+sessionStorage.getItem('nickname'));
		socket.emit('join',name);
		$(".login").hide();
		$(".allChat").show();
  }
}

socket.on('join',function(data){
	$('.leftChat .chatContent ul').append('<li class="cmsg"> '+data+' 已进入聊天室</li>')
})

socket.on('nicknames',function(data){
	var html='';
	var count=0;
	for(var i=0;i<data.length;++i){
		html+='<li class="username">'+data[i]+'</li>';
		count++;
		nicknameList.push(data[i]);
	}

	$('.rightContent ul').html(html);
	$('.rightChat footer .count').html(count);
	console.log(html);
})

socket.on('quit',function(data){
	$('.leftChat .chatContent ul').append('<li class="cmsg"> '+data+' 离开聊天室</li>')
})

socket.on('say',function(data){
	console.log(data.nickname+","+data.message);
	if(data.nickname == sessionStorage.getItem('nickname')){
		var text=data.message;
		var emotion_name="";
		var emotion_path="";
		var re = /\[[^\]]+\]/g;
		text=text.replace(re,function(){
			re_ret = re.exec(text);
			emotion_name = re_ret[0].replace(/\[/g,'').replace(/\]/g,'');
			emotion_path = emotion_name+".gif";
			return '<img title="'+emotion_name+'" src="/images//face/'+emotion_path+'" />';
		});
		$('.chatContent ul').append('<li class="clearfix"><span class="fr rmsg">我</span><div class="clr msg rmsg fr"><div class="bgCli msg-con fr"><i class="arrow-br"></i>'+text+'</div></div></li>');
		console.log(data.nickname);
		/*
		使得滚动条保持在底部
		*/
		$(".leftChat .chatContent").scrollTop($(".leftChat .chatContent").height());
	}
	else{
		var text=data.message;
		var emotion_name="";
		var emotion_path="";
		var re = /\[[^\]]+\]/g;
		text=text.replace(re,function(){
			re_ret = re.exec(text);
			emotion_name = re_ret[0].replace(/\[/g,'').replace(/\]/g,'');
			emotion_path = emotion_name+".gif";
			return '<img title="'+emotion_name+'" src="/images//face/'+emotion_path+'" />';
		});
		$('.chatContent ul').append('<li class="clearfix"><span>'+data.nickname+'</span><div class="msg lmsg"><div class="bgSer msg-con"><i class="arrow-tl"></i>'+text+'</div></div></li>');
		console.log(data.nickname);
		/*
		使得滚动条保持在底部
		*/
		$(".leftChat .chatContent").scrollTop($(".leftChat .chatContent").height());
	}
})
