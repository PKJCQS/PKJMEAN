var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('Zone');
    var fields = '_id isActive name zoneType school gateway createdOn createdBy modifiedOn modifiedBy';
    router.get('/zones\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
        db.loadModel('School');
        db.loadModel('ZoneType');
        db.loadModel('Gateway');
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
        }).populate('school').populate('zoneType').populate('gateway')
            .exec().then(function (doc) {
        });
    });
    router.post('/zones/add\.:ext"?', function (req, res) {
        const zoneModel = model;
        const newZone = new zoneModel(req.body.zone);
        zoneModel.create(newZone, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zones/autocomplete\.:ext/:str?', function (req, res) {
        model.find({'name' : new RegExp(req.params.str, 'i'),'isActive':true}, fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zones/classroom\.:ext//:str?', function (req, res) {
        model.find({'name' : new RegExp(req.params.str, 'i'), zoneType : "5af9940299f676087c6d3235", isActive : true}, fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zones/autocomplete-not-in-teacher-student\.:ext/:str?', function (req, res) {
        var  teacher = db.loadModel('Teacher');
        var  student = db.loadModel('Student');
        teacher.find({}, function (err, doc) {
            var usedT = doc.map(function (cl) { return cl.zone; });
            student.find({}, function (err, doc) {
                var usedS = doc.map(function (st) { return st.zone; });
                model.find({_id:{
                        $nin: usedT,
                        $nin: usedS,
                    },'isActive': true}, '_id mac isActive', function (err, doc) {
                    res.status(200).json(doc);
                });
            });
        });
    });
    router.get('/zones/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/zones/update\.:ext?', function (req, res) {
        model.findByIdAndUpdate(req.body.zone._id,req.body.zone, function (err, doc) {
        });

        model.findOne({_id: req.body.zone._id},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zones/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;
