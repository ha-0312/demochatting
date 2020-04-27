var socket = io("https://chattingappbyha.herokuapp.com");

//Dang ki that bai
socket.on("server-send-dangki-thatbai", function(){
  alert("Username da ton tai, Nhap lai !!");
});

//Dang ki thanh cong
socket.on("server-send-dangki-thanhcong", function(data){
  $("#currentUser").html(data);
  $("#loginForm").hide(1000); // an di trong 1s
  $("#chatForm").show(1000); // xuat hien trong 1s
});

socket.on("server-send-danhsach-usernames", function(data){
  $("#boxContent").html("");
  data.forEach(function(item){
    $("#boxContent").append("<div class='user'> "+ item + "</div>");
  });

});

socket.on("server-send-message", function(data){
  $("#listMessages").append("<div class='ms'>"+data.user+": "+data.mess+"</div>");
});

socket.on("ai-do-dang-go-chu", function(data){
  if(data != undefined){
    $("#thongbao").html("<img width='30px' src='typing.gif'>"+data);
  }
});

socket.on("ai-do-stop-go-chu", function(){
  $("#thongbao").html("");
});

$(document).ready(function(){
  $("#loginForm").show();
  $("#chatForm").hide();
  $("#btnRegister").click(function(){
    socket.emit("Client-send-Username", $("#txtUsername").val());
  });

  $("#btnLogout").click(function(){
    socket.emit("logout");
    $("#chatForm").hide();
    $("#loginForm").show();
  });

  $("#btnSendMessage").click(function(){
    if($("#txtMessage").val().length >0){
      socket.emit("client-send-message", $("#txtMessage").val());
    }else{
      alert("Moi nhap noi dung chat !!");
    }
    $("#txtMessage").focus();
    $("#txtMessage").val("");
  });

  $("#txtMessage").focusin(function(){
    socket.emit("dang-go-chu");
  });

  $("#txtMessage").focusout(function(){
    socket.emit("stop-go-chu");
  });
});
