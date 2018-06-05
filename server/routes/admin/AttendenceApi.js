var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('Gatewaydata');
    var fields = '_id gateway_id uuids response lattitude longitude createdOn bearing';
    router.get('/attendence\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
        var skip = parseInt(req.params.pageSize * req.params.page);
        var pagination = new Object();
        if(parseInt(req.params.pageSize))
            pagination.limit = parseInt(req.params.pageSize);
        if(skip)
            pagination.skip = skip;
        pagination.sort = {};
        var sortBy = req.params.sortBy;
        var sortType = req.params.sortType;
        if (sortBy && sortType){
            pagination.sort[sortBy] = sortType;
        }
        model.find({}, fields, pagination, function (err, doc) {
            var data = new Object();
            data.data = doc;
            model.count({}, function (err, count) {
                data.total = count;
                res.status(200).json(data);
            });
        }).populate('school')
            .exec().then(function (doc) {
        });
    });
    router.post('/attendence/add\.:ext/:gateway_id"?', function (req, res) {
        var alerts = db.loadModel('Alerts');
        var attendence = db.loadModel('Attendence');
        const attendenceModel = model;
        var uuids = [];
        var uids = [];
         //console.log(req.body);
       if(req.body.length > 0){
        for(var i=0; i< req.body.length; i++) {
                var value = req.body[i];
                if(value.ibeaconUuid && uids.indexOf(value.ibeaconUuid) === -1 ){
                    var a = {
                        "uuid" :   value.ibeaconUuid,
                        "mac"  :   value.mac
                    };
                    uuids.push(a);
                    uids.push(value.ibeaconUuid);
                }
                if(value.gatewayLoad){
                    var lat = value.lattitude;
                    var lng = value.longitude;
                    var bearing = value.bearing;
                }
            }
            db.loadModel('Gateway').findOne({mac:req.params.gateway_id},function(err, gt){
                if(gt._id){
                    db.loadModel('Zone').findOne({gateway:gt._id},function(err, zon){
                        
                        var indianTimeZoneVal = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
                        var ind = new Date(indianTimeZoneVal);
                        var indainDateObj = ind.getTime();
                        regObj = {
                            gateway_id : req.params.gateway_id,
                            zone: zon,
                            school_id : zon.school,
                            uuids  :     uuids,
                            response:   req.body,
                            lattitude :  lat,
                            longitude :  lng,
                            bearing :    bearing, 
                            createdOn: indainDateObj
                        };
                        if(uuids.length >= 0){
                            const newAttendence = new attendenceModel(regObj);
                            attendenceModel.create(newAttendence, function (err, doc) {
                                //console.log(doc);
                                for(var i=0; i< doc.response.length; i++) {
                                    var value = doc.response[i];
                                    if(value){
                                        db.loadModel('Idcard').findOne({uuid:value.ibeaconUuid},function(err, idcard){
                                            if(idcard){ 
                                                //console.log(idcard);
                                                var type = '';
                                                var data = {};
                                                db.loadModel('Student').findOne({idcard:idcard._id},function(err, stud){
                                                    if(stud) {
                                                        type = 'Student';
                                                        if(stud.access.indexOf(zon._id)==-1){
                                                            var data = new alerts({
                                                                gateway: gt._id,
                                                                gatewaydata: doc._id,
                                                                zone: zon._id,
                                                                student: stud._id,
                                                                idcard: idcard._id,
                                                                type: type,
                                                                school: zon.school,
                                                                createdOn: indainDateObj
                                                            });
                                                            alerts.findOne({
                                                                gateway: gt._id,
                                                                zone: zon._id,
                                                                student: stud._id,
                                                                idcard: idcard._id,
                                                                type: type,
                                                                school: zon.school,
                                                                createdOn: indainDateObj
                                                            },function(sr, dd){
                                                                //console.log(dd);
                                                                if(!dd){
                                                                    alerts.create(data, function (err, doc) {
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        var atData = new alerts({
                                                            gateway: gt._id,
                                                            gatewaydata: doc._id,
                                                            zone: zon._id,
                                                            student: stud._id,
                                                            idcard: idcard._id,
                                                            uuid: value.ibeaconUuid,
                                                            school: zon.school,
                                                            createdOn: indainDateObj
                                                        });
                                                        attendence.create(atData, function (err, doc) {
                                                        });
                                                    }
                                                    else
                                                    {
                                                        db.loadModel('Teacher').findOne({idcard:idcard._id},function(err, teach){
                                                            if(teach)
                                                            {
                                                                type = 'Teacher';
                                                                if(teach.access.indexOf(zon._id)==-1){
                                                                    var data = new alerts({
                                                                        gateway: gt._id,
                                                                        gatewaydata: doc._id,
                                                                        zone: zon._id,
                                                                        idcard: idcard._id,
                                                                        type: type,
                                                                        teacher: teach._id,
                                                                        school: zon.school,
                                                                        createdOn: indainDateObj
                                                                    });
                                                                    alerts.findOne({
                                                                        gateway: gt._id,
                                                                        zone: zon._id,
                                                                        idcard: idcard._id,
                                                                        type: type,
                                                                        teacher: teach._id,
                                                                        school: zon.school,
                                                                        createdOn: indainDateObj
                                                                    },function(er, dd){
                                                                        //console.log(dd);
                                                                        if(!dd){
                                                                            alerts.create(data, function (err, doc) {
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                                var atData = new alerts({
                                                                    gateway: gt._id,
                                                                    gatewaydata: doc._id,
                                                                    zone: zon._id,
                                                                    teacher: teach._id,
                                                                    idcard: idcard._id,
                                                                    uuid: value.ibeaconUuid,
                                                                    school: zon.school,
                                                                    createdOn: indainDateObj
                                                                });
                                                                attendence.create(atData, function (err, doc) {
                                                                });
                                                            }
                                                            else{
                                                                var data = new alerts({
                                                                    gateway: gt._id,
                                                                    gatewaydata: doc._id,
                                                                    zone: zon._id,
                                                                    idcard: idcard._id,
                                                                    type: type,
                                                                    school: zon.school,
                                                                    createdOn: indainDateObj
                                                                });
                                                                alerts.findOne({
                                                                    gateway: gt._id,
                                                                    zone: zon._id,
                                                                    idcard: idcard._id,
                                                                    type: type,
                                                                    school: zon.school,
                                                                    createdOn: indainDateObj
                                                                },function(er,dd) {
                                                                    //console.log(dd);
                                                                    if(!dd) {
                                                                        alerts.create(data, function (err, doc) {
                                                                        });
                                                                    }
                                                                });
                                                                var atData = new alerts({
                                                                    gateway: gt._id,
                                                                    gatewaydata: doc._id,
                                                                    zone: zon._id,
                                                                    idcard: idcard._id,
                                                                    uuid: value.ibeaconUuid,
                                                                    school: zon.school,
                                                                    createdOn: indainDateObj
                                                                });
                                                                attendence.create(atData, function (err, doc) {
                                                                });
                                                            }
                                                        });
                                                    }
                                                
                                                });
                                            }
                                        });
                                    }
                                }
                                res.status(200).json(
                                    [
                                        {
                                            "Status": true,
                                            "Msg": "Successfully Added"
                                        }
                                    ]
                                );
                            });
                        } else{
                            res.status(200).json(
                                [
                                    {
                                        "Status": false,
                                        "Msg":"No ibeacan read"
                                    }
                                ]
                            );
                        }
                    });
                }
                else {
                    res.status(200).json(
                        [
                            {
                                "Status": false,
                                "Msg":"No gateway Found"
                            }
                        ]
                    );
                }
        });
      }
      else {
        res.status(200).json(
            [
                {
                    "Status": false,
                    "Msg":"No data Found"
                }
            ]
        );
      }
    });
    router.get('/at\.:ext?', function (req, res) {
        var pagination = new Object();
            pagination.limit = 10;
        model.find({},fields, pagination, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.get('/attendence/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/attendence/update\.:ext?', function (req, res) {
        model.findByIdAndUpdate(req.body.attendence._id,req.body.attendence, function (err, doc) {
        });

        model.findOne({_id: req.body.attendence._id},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/attendence/updateAll\.:ext?', function (req, res) {
        var Async = require('async');
        model.find({},fields, function (err, doc) {
            Async.map(doc,function(item, callback) {
                var at = {
                    gateway_id: 'ac233fc00066',
                    uuids: item.uuids,
                    response:item.response,
                    lattitude: item.lattitude,
                    longitude: item.longitude,
                    bearing: item.bearing,
                    createdOn: item.createdOn
                }
                model.findByIdAndUpdate(item._id,at, function (err, dd) {
                    callback(null, dd);
                });
            },function(err,results) {
                res.status(200).json(results);
            });
        });
    });
    router.get('/attendence/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;