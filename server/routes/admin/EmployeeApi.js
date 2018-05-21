var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('Employee');
    var fields = '_id isActive name employeeType gateway school createdOn createdBy modifiedOn modifiedBy';
    router.get('/employees\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
        db.loadModel('School');
        db.loadModel('ZoneType');
        db.loadModel('Gateway');
        db.loadModel('Employee');
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
    router.post('/employees/add\.:ext"?', function (req, res) {
        const employeeModel = model;
        const newEmployee = new employeeModel(req.body.employee);
        employeeModel.create(newEmployee, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/employees/autocomplete\.:ext/:str?', function (req, res) {
        model.find({'uuid' : new RegExp(req.params.str, 'i'),'isActive':true}, '_id uuid isActive', function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/employees/autocomplete-not-in-teacher-student\.:ext/:str?', function (req, res) {
        var  teacher = db.loadModel('Teacher');
        var  student = db.loadModel('Student');
        teacher.find({}, function (err, doc) {
            var usedT = doc.map(function (cl) { return cl.employee; });
            student.find({}, function (err, doc) {
                var usedS = doc.map(function (st) { return st.employee; });
                model.find({_id:{
                        $nin: usedT,
                        $nin: usedS,
                    },'isActive': true}, '_id mac isActive', function (err, doc) {
                    res.status(200).json(doc);
                });
            });
        });
    });
    router.get('/employees/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/employees/update\.:ext?', function (req, res) {
        model.findByIdAndUpdate(req.body.employee._id,req.body.employee, function (err, doc) {
            model.findOne({_id: req.body.employee._id},fields, function (err, doc) {
                res.status(200).json(doc);
            });
        });
    });
    router.get('/employees/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;
