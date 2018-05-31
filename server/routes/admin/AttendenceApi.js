var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('Attendence');
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
        const attendenceModel = model;
        var uuids = [];
        var uids = [];
       //  console.log(req.params.gateway_id);
        for(var i=0; i< req.body.length; i++) {
            var value = req.body[i];
            if(value.ibeaconUuid && uids.indexOf(value.ibeaconUuid) >= 0 ){
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
        };
        db.loadModel('Gateway').findOne({mac:req.params.gateway_id},function(err, gt){
            db.loadModel('Zone').findOne({gateway:gt._id},function(err, zon){
            regObj = {
                gateway_id : req.params.gateway_id,
                zone: zon,
                school_id : zon.school,
                uuids  :     uuids,
                response:   req.body,
                lattitude :  lat,
                longitude :  lng,
                bearing :    bearing,
                createdOn: parseInt(new Date().getTime())
            };
            if(uuids.length > 0){
                const newAttendence = new attendenceModel(regObj);
                attendenceModel.create(newAttendence, function (err, doc) {
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
      });
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