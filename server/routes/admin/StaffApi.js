var loadRoutes = function (db, router, crypto) {
    // Get all posts
    var model = db.loadModel('Staff');
    var nodemailer = require('nodemailer');
    var fields = '_id isActive fname lname phone email school createdOn createdBy modifiedOn modifiedBy';
    function randomPassword(digit) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < digit; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    router.get('/staffs\.:ext/:page/:pageSize/:sortBy/:sortType?', function (req, res) {
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
        }).populate('school')
            .exec().then(function (doc) {
        });
    });
    router.post('/staffs/add\.:ext"?', function (req, res) {
        const staffModel = model;
        req.body.staff.password = crypto.encrypt(req.body.staff.password);
        const newStaff = new staffModel(req.body.staff);
        staffModel.create(newStaff, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.post('/staffs/login\.:ext?', function (req, res) {
        model.findOne({phone:req.body.phone, password:crypto.encrypt(req.body.password)},fields, function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.post('/staffs/forgot-password\.:ext?', function (req, res) {
        model.findOne({email:req.body.email},fields, function (err, doc) {
            if(doc) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'pradeep.jangra94@gmail.com',
                        pass: '07031114054'
                    }
                });
                var otp = randomPassword(6);
                const forgot = new db.loadModel('Forgot')({
                    email: req.body.email,
                    userDtl: doc,
                    otp : otp,
                    valid: 5
                });
                db.loadModel('Forgot').create(forgot, function (err1, doc1) {
                    var mailOptions = {
                        from: 'pradeep.jangra94@gmail.com',
                        to: doc.email,
                        subject: 'OTP for reset password',
                        html: "The otp for reset password is : <strong>" + otp + "</strong>"
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            res.status(200).json(false);
                        } else {
                            res.status(200).json(true);
                        }
                    });
                });

            } else{
                res.status(200).json('invalid');
            }
        });
    });
    router.get('/staffs/verify-otp\.:ext', function (req, res) {
        db.loadModel('Forgot').find({'email' : req.body.email,'otp':req.body.otp}, function (err, doc) {
            if (doc) {
                var dtNow = new Date();
                var dt1 = new Date(doc.createdOn);
                var diff = Math.abs(dtNow - dt1);
                if (Math.floor((diff / 1000) / 60) > 5) {
                    res.status(200).json('expired');
                }
                else {
                    res.status(200).json(doc);
                }
            } else{
                res.status(200).json('invalid');
            }
        });
    });
    router.get('/staffs/change-password\.:ext', function (req, res) {
        db.loadModel('Forgot').find({'uuid' : new RegExp(req.params.str, 'i'),'isActive':true}, '_id uuid isActive', function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/staffs/autocomplete\.:ext/:str?', function (req, res) {
        model.find({'uuid' : new RegExp(req.params.str, 'i'),'isActive':true}, '_id uuid isActive', function (err, doc) {
            res.status(200).json(doc);
        });
    });
    router.get('/staffs/view\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id},fields, function (err, doc) {
            res.status(200).json(doc);
        })
    });
    router.post('/staffs/update\.:ext?', function (req, res) {
        if(req.body.staff.password)
            req.body.staff.password = crypto.encrypt(req.body.staff.password);
        model.findByIdAndUpdate(req.body.staff._id,req.body.staff, function (err, doc) {
            if(doc) {
                model.findOne({_id: req.body.staff._id}, fields, function (err, doc) {
                    res.status(200).json(doc);
                });
            }
        });
    });
    router.get('/staffs/delete\.:ext/:id?', function (req, res) {
        model.findOne({_id : req.params.id}).remove().exec();
        model.find({}, function (err, doc) {
            res.status(200).json(doc);
        })
    });
};
module.exports.loadRoutes = loadRoutes;
