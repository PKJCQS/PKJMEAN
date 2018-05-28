const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const db1 = require('./server/database/dbConfig');
// Get our API routes

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes

// Catch all other routes and return the index file
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '5000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

const io = require('socket.io')(server);
function updateAttendence(school){
    var pagination = new Object();
    pagination.limit = 10;
    db1.loadModel('Gateway').find({'school':school,'isActive': true},function (err,gateways) {
        //console.log(gateways);
        var gateways = gateways.map(function (st) { return st.mac; });
        db1.loadModel('Attendence').find({gateway_id:{
                $in: gateways,
            }}, '_id gateway_id uuids response lattitude longitude createdOn bearing', function (err, doc) {
            io.sockets.emit('latestAtendence', doc);
            setTimeout(function(){updateAttendence(school);},5000);
        });
    });
}

io.on('connection', function(socket) {

    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('setSchool', function(school){
        updateAttendence(school)
    });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
    console.log('API running on localhost:', port);
});