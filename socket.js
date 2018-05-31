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
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    db1.loadModel('Gateway');
    db1.loadModel('School');
    db1.loadModel('Zone');
    var data = new Object();
    var types = db1.loadModel('ZoneType');
        
    db1.loadModel('Attendence').find({"school_id":school, "createdOn": {$gte: start.toISOString(), $lt: end.toISOString()}}, function (err, doc) {

    }).populate('school_id').populate('zone')
    .exec().then(function (doc) {
        Async.map(doc,function(item, callback) {
            var callb =0;
            for(var i =0; i < item.uuids.length; i++) {
                var item1 = item.uuids[i];
                if(item1['uuid']){
                    var ibdata = item.response.find( ib => ib.ibeaconUuid === item1['uuid'] );
                    var distance = calculateDistance(ibdata.rssi, ibdata.ibeaconTxPower);
                    
                    //console.log(ibdata);
                    db1.loadModel('Idcard').findOne({uuid:item1['uuid']},function(err1, doc1){
                        if(doc1){
                            db1.loadModel('Student').findOne({idcard:doc1._id},function(err2, doc2){
                                if(doc2) {
                                    db1.loadModel('ZoneType').findOne({_id:item.zone.zoneType},function(err3, doc3){
                                        //console.log(doc2.access, item.zone._id);
                                        //console.log(doc2.access.indexOf(item.zone._id), distance, parseInt(item.zone.readingDistance), (doc2.access.indexOf(item.zone._id)===-1 && distance < parseInt(item.zone.readingDistance)));
                                        if(doc2.access.indexOf(item.zone._id)===-1 && distance < parseInt(item.zone.readingDistance)){
                                            if(students.indexOf(doc2._id.toString())==-1){
                                                students.push(doc2._id.toString());
                                                excep.push({createdOn: item.createdOn, student:doc2, zone: item.zone,zoneType: doc3, distance:distance});
                                                if(callb==0){
                                                    callb = 1;
                                                    callback({createdOn: item.createdOn, student:doc2, zone: item.zone,zoneType: doc3, distance:distance});
                                                }
                                            }
                                            
                                        }
                                    });
                                }
                                else{
                                    db1.loadModel('Teacher').findOne({idcard:doc1._id},function(err4, doc4){
                                        if(doc4){
                                            db1.loadModel('ZoneType').findOne({_id:item.zone.zoneType},function(err3, doc3){
                                                if(doc4.access.indexOf(item.zone._id.toString())===-1 && distance < parseInt(item.zone.readingDistance)){
                                                    if(students.indexOf(doc4._id.toString())==-1){
                                                        students.push(doc4._id.toString());
                                                        excep.push({createdOn: item.createdOn, student:doc4, zone: item.zone,zoneType: doc3, distance:distance});
                                                        if(callb==0){
                                                            callb = 1;
                                                            callback({createdOn: item.createdOn, student:doc4, zone: item.zone,zoneType: doc3, distance:distance});
                                                        }
                                                    }
                                                   
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        },function(r1){
            types.find({},function(error, zoneTypes){
                Async.map(zoneTypes,function(item, cb1) {
                    db1.loadModel('Zone').find({zoneType : item._id}, function (err, doc) {
                        Async.map(doc, function(zn, cb) {
                            var end = new Date();
                            var start = end.setSeconds(end.getSeconds()-10);
                            db1.loadModel('Attendence').find({"school_id":school,"createdOn": {$gte: start.toISOString(), $lt: end.toISOString()} }, function (err, stds) {
                                console.log( stds );
                                Async.map(stds,function(item, callback) {
                                    var callb =1;
                                    for(var i =0; i < item.uuids.length; i++) {
                                        if(i==item.uuids.length-1) {
                                            callb = 0
                                        }
                                        var item1 = item.uuids[i];
                                        if(item1['uuid']){
                                            var ibdata = item.response.find( ib => ib.ibeaconUuid === item1['uuid'] );
                                            var distance = calculateDistance(ibdata.rssi, ibdata.ibeaconTxPower);
                                        }
                                        if(distance < parseInt(item.zone.readingDistance) && sts.indexOf(item1['uuid'])===-1){
                                            sts.push(item1['uuid']);
                                        }
                                        if(callb==0) {
                                            callback('hi');
                                        }
                                    }
                                },function(rss){
                                    //console.log(rss);
                                    var count = sts.length;
                                    cb(null,{zone:zn, count_ids: count});
                                });
                            });
                        },function(err,rs) {
                            //console.log('zone',rs);
                            cb1(null,{zoneType:item, zone: rs});
                        });
                    });
                },function(err,results) {
                    //console.log(students);
                    data.exceptions = excep;
                    data.zoneTypes = results;
                    io.sockets.emit('latestAtendence', data);
                    setTimeout(function(){updateAttendence(school);},5000);
                });
            });
            
            //data.exceptions = exceptions;
            //data.zoneTypes = results;
            //io.sockets.emit('latestAtendence', data);
            //setTimeout(function(){updateAttendence(school);},5000);
        });
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