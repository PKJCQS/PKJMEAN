var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var fields = '_id teacher school classroom subject startTime endTime comment isActive createdOn createdBy modifiedOn modifiedBy';
    var Timetable = db.loadModel('Timetable');
    router.get('/timetables\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
        var skip = parseInt(req.params.pageSize * req.params.page);
        var pagination = new Object();
        if(parseInt(req.params.pageSize))
            pagination.limit = parseInt(req.params.pageSize);
        if(skip)
            pagination.skip = skip;

        var sortBy = req.params.sortBy;
        var sortType = req.params.sortType;
        if (sortBy && sortType){
            pagination.sort = {};
            pagination.sort[sortBy] = sortType;
        }


        Timetable.find({}, fields, pagination, function (err, doc) {
            var data = new Object();
            data.data = doc;
            Timetable.count({}, function (err, count) {
                data.total = count;
                res.status(200).json(data);
            });
        });
    });
    router.get('/timetables/getByClassroom\.:ext/:class?', function (req, res) {
        Timetable.find({classroom: req.params.class}, fields, function (err, doc) {
                res.status(200).json(doc);
        });
    });
    router.get('/timetables/getByClassroom\.:ext/:class?', function (req, res) {
        Timetable.find({classroom: req.params.sortBy}, fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/timetables/autocomplete\.:ext/:str?', function (req, res) {
        Timetable.find({'name' : new RegExp(req.params.str, 'i'),'isActive':true}, '_id name isActive', function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.post('/timetables/add\.:ext"?', function (req, res) {
        const timetableModel = Timetable;
        const newTimetable = new timetableModel(req.body.timetable);
        timetableModel.create(newTimetable, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.post('/timetables/login\.:ext?', function (req, res) {
        Timetable.findOne({username:req.body.username, password:crypto.encrypt(req.body.password)},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/timetables/view\.:ext/:id?', function (req, res) {
        Timetable.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/timetables/update\.:ext?', function (req, res) {
        if(typeof  req.body.timetable.password != 'undefined')
            req.body.timetable.password = crypto.encrypt(req.body.timetable.password);
        Timetable.findByIdAndUpdate(req.body.timetable._id,req.body.timetable, function (err, doc) {
        });

        Timetable.findOne({_id: req.body.timetable._id},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
};
module.exports.loadRoutes = loadRoutes;
