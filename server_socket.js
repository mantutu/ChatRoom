// 服务器端
var io = require('socket.io')();
var nicknames=[];

io.sockets.on('connection',function(socket){
	console.log(nicknames);
	console.log(socket.id + ': connection');

	socket.emit('nicknames',nicknames);

	socket.on('nickname',function(data){
		nicknames.push(data);
		socket.nickname=data;
		socket.emit('nicknames',nicknames);
		socket.broadcast.emit('nicknames',nicknames);
		console.log(socket.nickname);
		console.log('nicknames are '+nicknames);
	});

	socket.on('say',function(data){
		socket.emit('say',{
			nickname:socket.nickname,
			message:data
		});
		socket.broadcast.emit('say',{
			nickname:socket.nickname,
			message:data
		});
	})

	socket.on('join',function(data){
		socket.emit('join',data);
		socket.broadcast.emit('join',data);
	})


  	socket.on('disconnect',function(){
  		console.log(socket.id + ': disconnect');

  		if(!socket.nickname) return ;
  		if(nicknames.indexOf(socket.nickname) > -1){
  			nicknames.splice(nicknames.indexOf(socket.nickname),1);
  			console.log(nicknames);
  		}
  		socket.emit('quit',socket.nickname);
  		socket.broadcast.emit('quit',socket.nickname);
  		socket.emit('nicknames',nicknames);
  		socket.broadcast.emit('nicknames',nicknames);
  	});
});

exports.listen = function (server) {
    return io.listen(server);
};
