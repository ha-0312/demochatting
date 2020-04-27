var express = require("express");
var app = express();
app.use(express.static("public")); // tat ca request len server vao het thu muc public
app.set("view engine", "ejs");     // tao 1 cai view engine cua ejs
app.set("views", "./views");

var server = require("http").Server(app); // tao server
var io = require("socket.io")(server);
server.listen(process.env.PORT || 8888);

var listUser = [];
io.on("connection", function(socket){
  console.log("Co nguoi ket noi "+ socket.id);
  //lang nghe event khi bam Dang ki
  socket.on("Client-send-Username", function(data){
    if(listUser.indexOf(data) >= 0){
      // index >= 0 : username da co trong mang listUser
      socket.emit("server-send-dangki-thatbai");
    }else{
      // Dang ki thanh cong
      listUser.push(data);
      socket.userName = data;
      socket.emit("server-send-dangki-thanhcong",data);
      io.sockets.emit("server-send-danhsach-usernames", listUser);
    }
  });
  socket.on("logout", function(){
    listUser.splice(listUser.indexOf(socket.userName), 1); //xoa tu vi tri co userName, 1: xoa chinh username do
    socket.broadcast.emit("server-send-danhsach-usernames", listUser);
  });
  socket.on("client-send-message", function(data){
    io.sockets.emit("server-send-message", {user: socket.userName, mess: data})
  });

  socket.on("dang-go-chu",function(){
    var s = socket.userName + " dang go chu";
    io.sockets.emit("ai-do-dang-go-chu", s);
  });

  socket.on("stop-go-chu",function(){
    io.sockets.emit("ai-do-stop-go-chu");
  });
});

app.get("/", function(req, res){
  res.render("trangchu");
})
