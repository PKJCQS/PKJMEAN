var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('ZoneType');
    var fields = '_id isActive name createdOn createdBy modifiedOn modifiedBy';
    router.get('/zoneTypes\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
        db.loadModel('School');
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
        });
    });
    router.post('/zoneTypes/add\.:ext"?', function (req, res) {
        const zoneTypeModel = model;
        const newZoneType = new zoneTypeModel(req.body.zoneType);
        zoneTypeModel.create(newZoneType, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zoneTypes/autocomplete\.:ext/:str?', function (req, res) {
        model.find({'name' : new RegExp(req.params.str, 'i'),'isActive':true}, fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zoneTypes/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/zoneTypes/update\.:ext?', function (req, res) {
        model.findByIdAndUpdate(req.body.zoneType._id,req.body.zoneType, function (err, doc) {
        });

        model.findOne({_id: req.body.zoneType._id},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/zoneTypes/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;
