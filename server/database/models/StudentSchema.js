'use strict';
const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
        isActive: Boolean,
        firstName: String,
        middleName: String,
        lastName: String,
        gender: String,
        aadhar: String,
        classroom: {type: mongoose.Schema.ObjectId, ref: 'Zone'},
        parent: {type: mongoose.Schema.ObjectId, ref: 'Parent'},
        pickup:{type: mongoose.Schema.ObjectId, ref: 'Pickup'},
        rollNo: String,
        idcard: {type: mongoose.Schema.ObjectId, ref: 'Idcard'},
        school:{type: mongoose.Schema.ObjectId, ref: 'School'},
        address: String,
        password: String,
        access: [],
        createdOn: String,
        createdBy: String,
        modifiedOn: String,
        modifiedBy: String
    },
    {
        minimize: false,
        versionKey: false
    });

module.exports = {
    'model': mongoose.model('Student', studentSchema)
}
