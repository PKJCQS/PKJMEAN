var forEach = require('async-foreach').forEach;
var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('Route');
    var fields = '_id isActive name pickups createdOn createdBy modifiedOn modifiedBy';
    router.get('/routes\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
        db.loadModel('RouteInfo');
        db.loadModel('Pickup');
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

            //data.data = doc;
        }).populate('pickups.route1')
            .exec().then(function (doc) {
            var data = new Object();
            var options = {
                path: 'pickups.pickup1',
                model: 'Pickup'
            };

            model.populate(doc, options, function (err, projects) {
                data.data = projects;
                model.count({}, function (err, count) {
                    data.total = count;
                    res.status(200).json(data);
                });
            });
        });
    });
    router.post('/routes/add\.:ext"?', function (req, res) {
        const routeModel = model;
        const routeInfoModel = db.loadModel('RouteInfo');
        const newRoute = new routeModel(req.body.route);
        routeModel.create(newRoute, function (err, doc) {
            model.find({}, function (err, doc) {
                res.status(200).json(doc);
            });
        });
    });
    router.get('/routes/autocomplete\.:ext/:str?', function (req, res) {
        model.find({'name' : new RegExp(req.params.str, 'i'),'isActive':true}, fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/routes/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/routes/update\.:ext?', function (req, res) {
        const routeInfoModel = db.loadModel('RouteInfo');
        var error = false;
        model.findByIdAndUpdate(req.body.route._id,req.body.route, function (err, doc) {
            model.findOne({_id: req.body.route._id}, fields, function (err, doc2) {
                res.status(200).json(doc2);
            });
        });
    });
    router.get('/routes/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;
