var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('EmployeeType');
    var fields = '_id isActive name createdOn createdBy modifiedOn modifiedBy';
    router.get('/employeeTypes\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
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
    router.post('/employeeTypes/add\.:ext"?', function (req, res) {
        const employeeTypeModel = model;
        const newEmployeeType = new employeeTypeModel(req.body.employeeType);
        employeeTypeModel.create(newEmployeeType, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/employeeTypes/autocomplete\.:ext/:str?', function (req, res) {
        model.find({'name' : new RegExp(req.params.str, 'i'),'isActive':true}, fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/employeeTypes/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/employeeTypes/update\.:ext?', function (req, res) {
        model.findByIdAndUpdate(req.body.employeeType._id,req.body.employeeType, function (err, doc) {
        });

        model.findOne({_id: req.body.employeeType._id},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/employeeTypes/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;
