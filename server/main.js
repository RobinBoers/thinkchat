// INITIALIZE

// Initialize http, cors and socket.io
var http = require('http').createServer();
var cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
      origin: "*",
      methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["origin", "x-requested-with", "content-type"]
    }
});

var users = [];
var userCount = 0;

// When client connects
io.on('connection', (client) => {
    const id = client.id;

    // Show message when client connects
    console.log('Client ' + id + ' connected.');
    client.emit('connected');

    // When client joins
    client.on('joined', function (username) {      
        users[id] = username;

        var msg = username + " joined.";
        console.log(msg);

        // Emit message
        client.broadcast.emit('message', msg);
        client.emit("message", "You joined.");

        // Update usercount
        userCount++;
        io.emit('userCount', { userCount: userCount });
    });

    // When client disconnects / leaves
    client.on('disconnect', () => {
        console.log('Client ' + id + ' disconnected.');

        var username = "Unknown";
        username = users[id];

        var msg = username + " left.";
        console.log(msg);

        // Emit message
        io.emit('message', msg);

        // Update usercount
        userCount--;
        io.emit('userCount', { userCount: userCount });
    });

    // When the client sends message
    client.on('message', (msg, username) => {
        
        var str = username + ': ' + msg;

        // Log the message
        console.log(str);

        // Send the message to the clients
        io.emit('message', msg, username);
    });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});