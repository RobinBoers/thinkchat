// This file is part of ThinkChat which is released under the MIT license.
// See file LICENSE or go to https://github.com/RobinBoers/thinkchat/blob/main/LICENSE 
// for full license details.

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

// Track users and usercount
var users = [];
var userCount = 0;

// When client connects
io.on('connection', (client) => {

    // Get client ID
    const id = client.id;

    // Show debug message when client connects
    // End send the client a message
    console.log('Client ' + id + ' connected.');
    client.emit('connected');

    // When client joins
    client.on('joined', function (username, roomName) {      
        // Register client for later use
        users[id] = username;

        // Connect to default room
        client.join("GENERAL");

        // Message when client joins
        var msg = username + " joined.";
        console.log(msg);

        // Emit message to clients
        client.to("GENERAL").emit('message', msg);
        client.emit("message", "You joined.");

        // Update usercount
        userCount++;
        io.emit('userCount', { userCount: userCount });
    });

    // When client disconnects / leaves
    client.on('disconnect', () => {
        // Show debug message when client disconnects
        console.log('Client ' + id + ' disconnected.');

        // Get username
        var username = "Unknown";
        username = users[id];

        if (username !== undefined) {
            // Message when client leaves
            var msg = username + " left.";
            console.log(msg);

            // Emit message to other clients
            io.emit('message', msg);

            // Update usercount
            userCount--;
            io.emit('userCount', { userCount: userCount });
        }

        
    });

    // When client wants to join a room
    client.on('joinRoom', (username, roomName, oldRoom) => {

        // Message when client leaves room
        var msg = username + " left.";
        console.log(msg);

        // Emit message to clients
        client.to(oldRoom).emit('message', msg);

        // Leave room
        client.leave(oldRoom);

        // Join new room
        client.join(roomName);

        // Message when client joins room
        var msg = username + " joined.";
        console.log(msg);

        // Emit message to clients
        client.to(roomName).emit('message', msg);
        client.emit("message", "You joined.");
        
    });

    // When the client sends message
    client.on('message', (msg, username, roomName) => {

        // Check if the string only contains
        // spaces. If so, don't send it
        if (!msg.replace(/\s/g, '').length) {

            // Tell the client the message was invalid
            client.emit('invalid');

            // Log the invalid message
            console.log(username + ' tried to send a invalid message!');

        } else {

            // Log the message
            console.log('[' + roomName + '] ' + username + ': ' + msg);

            // Send the message to the clients
            io.in(roomName).emit('message', msg, username);

        }
    });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});