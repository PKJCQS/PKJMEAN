'use strict';
const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
        isActive: Boolean,
        fname: String,
        lname: String,
        phone: String,
        password: String,
        email: String,
        school:{type: mongoose.Schema.ObjectId, ref: 'School'},
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
    'model': mongoose.model('Staff', staffSchema)
}
