var socket = io("http://localhost:3000");

var start = document.getElementById('start');
var chat = document.getElementById('chat')

start.style.display = "block";
chat.style.display = "none";

var messages = document.getElementById('messagelist');
var chatForm = document.querySelector('#chatform');
var startForm = document.querySelector('#startform');

var startInput = document.querySelector('#startinput');
var input = document.querySelector('#input');

let params = new URLSearchParams(location.search);
var check = false;
var username = params.get('name');

users = [];

function reload() {
    if (username == "" || username == undefined) {
        check = false;
        start.style.display = "block";
        chat.style.display = "none";
    } else {
        check = true;
        start.style.display = "none";
        chat.style.display = "block";
    }

    if (input.value == "") {
        input.style.color = "var(--color3)";
    } else {
        input.style.color = "var(--text-color)";
    }

    return check;
}

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value && check) {
        socket.emit('message', input.value, username);
        input.value = '';
    }
    input.focus();
});

startForm.addEventListener('submit', function(e) {
    e.preventDefault();
    username = startInput.value;
    var joined = reload();

    if (joined) {
      userTag = generatePin();
      username = username + userTag;
      socket.emit('joined', username);
    }
});

socket.on('connected', () => {console.log("Connected.")});
socket.on('message', function (msg, username) {
  var item = document.createElement('li');

  if (username) {
    msg = "<span style='color:#" + LightenDarkenColor(intToRGB(hashCode(username)), 80) + ";'>" + username + "</span>: " + msg;
  }
  
  item.innerHTML = msg;
  messages.appendChild(item);

  window.scrollTo(0, document.body.scrollHeight);

  // Notifications

  // var img = 'imgages/icon.png';
  // var text = msg;
  // var n = new Notification('Message from '+username, { body: text, icon: img });
  
});

function generatePin () {
  min = 0,
  max = 9999;
  return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
}

function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
} 

function intToRGB(i){
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

function LightenDarkenColor(col,amt) {
  var usePound = false;
  if ( col[0] == "#" ) {
      col = col.slice(1);
      usePound = true;
  }

  var num = parseInt(col,16);

  var r = (num >> 16) + amt;

  if ( r > 255 ) r = 255;
  else if  (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if ( b > 255 ) b = 255;
  else if  (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if ( g > 255 ) g = 255;
  else if  ( g < 0 ) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

socket.on('userCount', function (data) {
  console.log(data.userCount);
  document.getElementById("user-count").innerHTML = "<span class='count'>" + data.userCount + "</span> users online"
});