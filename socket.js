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
function calculateDistance(rssi, txPower) {
    if (rssi == 0) {
      return -1.0;
    }
    var ratio = rssi*1.0/txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio,10);
    }
    else {
      var distance =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;
      return distance;
    }
  }
  
function updateAttendence(school){
    var excep = [];
    var students = [];
    var sts = [];
    var indianTimeZoneVal = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
    var start = new Date(indianTimeZoneVal);
    start.setHours(0,0,0,0);
    start = new Date(start).getTime();
    var end = new Date();
    end.setHours(23,59,59,999);
    end = new Date(end).getTime();
    //console.log(start,end);
    var d = new Date(indianTimeZoneVal);
    var end1 = parseInt(d.getTime());
    var start1 = parseInt(new Date(d.setMinutes(d.getMinutes()-10)).getTime());
    db1.loadModel('Gateway');
    db1.loadModel('School');
    db1.loadModel('Zone');
    var data = new Object();
    var types = db1.loadModel('ZoneType');
        
    db1.loadModel('Alerts').find({"school_id":school, "createdOn": {$gte: start, $lt: end}}, function (err, doc) {

    }).populate('school_id').populate('zone').populate('gateway').populate('gatewaydata').populate('idcard').populate('teacher').populate('student')
    .exec().then(function (excep) {
        var d = new Date(indianTimeZoneVal);
        var end1 = parseInt(d.getTime());
        var start1 = parseInt(new Date(d.setMinutes(d.getMinutes()-10)).getTime());
        // console.log(start1,end1,d);
        db1.loadModel('Gatewaydata').find({"school_id":school,"createdOn": {$gte: start1, $lt: end1} }, function (err, stds) {
            types.find({},function(error, zoneTypes){ 
                if(zoneTypes) {
                    Async.map(zoneTypes,function(item, cb1) {
                        db1.loadModel('Zone').find({zoneType : item._id}, function (err, doc) {
                            if(doc){
                                Async.map(doc, function(zn, cb) {
                                    //cb(null,{zone:zn,count_ids:sts[zn._id].length});
                                        sts[zn.__id] = [];
                                        if(stds){
                                            Async.map(stds,function(item, callback) {
                                                var callb = 1;
                                                for(var i =0; i < item.uuids.length; i++) {
                                                    if(i==item.uuids.length-1) {
                                                        callb = 0
                                                    }
                                                    var item1 = item.uuids[i];
                                                    
                                                    if(item1['uuid']){
                                                        var ibdata = item.response.find( ib => ib.ibeaconUuid === item1['uuid'] );
                                                        var distance = calculateDistance(ibdata.rssi, ibdata.ibeaconTxPower);
                                                        console.log(distance, parseInt(zn.readingDistance));
                                                        if(distance < parseInt(zn.readingDistance) && sts[zn.__id].indexOf(item1['uuid'])===-1){
                                                            if(item.zone==zn.__id){
                                                                sts[zn.__id].push(item1['uuid']);
                                                            }
                                                        }
                                                    }
                                                    
                                                    if(callb==0) {
                                                        callback(sts[zn.__id].length);
                                                    }
                                                }
                                            },function(rss){
                                                console.log(rss,'sts');
                                                var count = sts.length;
                                                cb(null,{zone:zn, count_ids: count});
                                            });
                                        }
                                },function(err,rs) {
                                    //console.log('zone',rs);
                                    cb1(null,{zoneType:item, zone: rs});
                                });
                            }
                        });
                    },function(err,results) {
                        console.log(students);
                        data.exceptions = excep;
                        data.zoneTypes = results;
                        io.sockets.emit('latestAtendence', data);
                        setTimeout(function(){updateAttendence(school);},5000);
                    });
                }
            });
        });        
                //data.exceptions = exceptions;
                //data.zoneTypes = results;
                //io.sockets.emit('latestAtendence', data);
                //setTimeout(function(){updateAttendence(school);},5000);
        // io.sockets.emit('latestAtendence', doc);
        //     setTimeout(function(){updateAttendence(school);},5000);
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