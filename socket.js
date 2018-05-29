const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
var Async = require('async');
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
    var today = dateFormat(new Date(),"yyyy-mm-dd");
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    db1.loadModel('Attendence').find({"school_id":school,"createdOn": {$gte: start, $lt: end} }, function (err, doc) {
        Async.map(doc,function(item, callback) {
            for(var i=0; i < item.uuids.length; i++){
                db1.loadModel('Idcard').findOne({uuid:item.uuids[i].uuid},function(err1, doc1){
                    if(doc1){
                        db1.loadModel('Student').findOne({idcard:doc1._id},function(err2, doc2){
                            if(doc2.access.indexOf()){
                                callback(null, {createdOn: item.createdOn, student:doc2, });
                            } else{
                                db1.loadModel('Teacher').findOne({idcard:doc1._id},function(err3, doc3){

                                });
                            }
                        });
                    }
                });
            }
        },function(results){
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