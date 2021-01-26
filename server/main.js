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
    client.on('joined', function (username) {      
        // Register client for later use
        users[id] = username;

        // Message when client joins
        var msg = username + " joined.";
        console.log(msg);

        // Emit message to clients
        client.broadcast.emit('message', msg);
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

        // Message when client leaves
        var msg = username + " left.";
        console.log(msg);

        // Emit message to other clients
        io.emit('message', msg);

        // Update usercount
        userCount--;
        io.emit('userCount', { userCount: userCount });
    });

    // When the client sends message
    client.on('message', (msg, username) => {

        // Check if the string only contains
        // spaces. If so, don't send it
        if (!msg.replace(/\s/g, '').length) {

            // Tell the client the message was invalid
            client.emit('invalid');

            // Log the invalid message
            console.log(username + ' tried to send a invalid message!');

        } else {

            // Log the message
            console.log(username + ': ' + msg);

            // Send the message to the clients
            io.emit('message', msg, username);

        }
    });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});