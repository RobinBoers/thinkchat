// This file is part of ThinkChat which is released under the MIT license.
// See file LICENSE or go to https://github.com/RobinBoers/thinkchat/blob/main/LICENSE 
// for full license details.

// Initialize Socket.io (included from CDN)
var socket = io("http://localhost:3000");

// Get screens from HTML (this is like pages, but on 1 page)
var start = document.getElementById('start');
var chat = document.getElementById('chat')

// Hide chat screen and show startscreen
start.style.display = "block";
chat.style.display = "none";

// Get elements from HTML
var messages = document.getElementById('messagelist');
var chatForm = document.querySelector('#chatform');
var startForm = document.querySelector('#startform');

// Get inputfields
var startInput = document.querySelector('#startinput');
var input = document.querySelector('#input');

// Check if there already is a saved 
// username in LocalStorage
var useStorage = false;

window.addEventListener("load", () => {
  localStorage = window.localStorage;
  

  if (typeof (Storage) !== "undefined") {

    // Tell the rest of the script to use
    // localStorage
    useStorage = true;

    // Get username from localStorage
    username = localStorage.getItem('name');
    
    // Reload to apply changes
    reload();
    socket.emit('joined', username);

  } else {
    console.log('No localSorage support.');
  }
})

// Used to check if username is correct
var check = false;

// Reload function. Used to check if username is 
// valid and change color on inputfield
// It is also used to show or hide the sidebar
function reload() {

    const width = document.body.clientWidth;
    if (width > 765) {
        openNav();
    } else {
      closeNav();
    }

    if (username == "" || username == undefined || username == null) {
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

// When sending message (hit enter on message bar)
chatForm.addEventListener('submit', function (e) {
  
  // Make sure it doesn't reload the page
  e.preventDefault();

  // If the input isn't empty and 
  // the user has a nickname continue
  if (input.value && check) {
        socket.emit('message', input.value, username);
        input.value = '';
  }
  
  // Put focus back in input field
  input.focus();
});

// When entering nickname
startForm.addEventListener('submit', function (e) {
  
  // Make sure it doesn't reload the page
  e.preventDefault();
  
  // Set username
  username = startInput.value;

  // Check if username is valid by reloading
  var joined = reload();

  // If valid, send a message to the server
  if (joined) {

    // Generate random tag
    userTag = generatePin();

    // Append tag to username
    username = username + userTag;

    // Save username in localStorage
    if(useStorage) localStorage.setItem('name', username);

    // Send username to server
    socket.emit('joined', username);
    
  }

});

socket.on('connected', () => { console.log("Connected.") });
socket.on('userCount', function (data) {

  // Set usercount on top of screen
  document.getElementById("user-count").innerHTML = "<span class='count'>" + data.userCount + "</span> users online"

});
socket.on('invalid', function (data) {

  // Set usercount on top of screen
  // alert("Your message was invalid");
  console.log('Invalid message. Message must contain characters');

});
socket.on('message', function (msg, username) {

  // Create new HTML element
  var item = document.createElement('li');

  // Check if the message is sent by 
  // a user (aka when a username is provided by the server)
  if (username) {
    msg = "<span style='font-weight:bold;color:#" + LightenDarkenColor(intToRGB(hashCode(username)), 80) + ";'>" + username + "</span> &nbsp; " + msg;
  }
  
  // Put message in the newly-created
  // HTML element
  item.innerHTML = msg;

  // Append the newly-created element
  // to the messagelist
  messages.appendChild(item);

  // Scroll to bottom
  // window.scrollTo(0, document.body.scrollHeight);
  messages.scrollTo(0, document.body.scrollHeight);
  
});
