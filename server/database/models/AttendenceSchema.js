'use strict';
const mongoose = require('mongoose');
const attendenceSchema = new mongoose.Schema({
        gateway: {type: mongoose.Schema.ObjectId, ref: 'Gateway'},
        gatewaydata: {type: mongoose.Schema.ObjectId, ref: 'Gatewaydata'},
        zone: {type: mongoose.Schema.ObjectId, ref: 'Zone'},
        idcard: {type: mongoose.Schema.ObjectId, ref: 'Idcard'},
        student: {type: mongoose.Schema.ObjectId, ref: 'Student'},
        teacher: {type: mongoose.Schema.ObjectId, ref: 'Teacher'},
        uuid: String,
        school:{type: mongoose.Schema.ObjectId, ref: 'School'},
        createdOn: Number
    },
    {
        minimize: false,
        versionKey: false
    });

module.exports = {
    'model': mongoose.model('Attendence', attendenceSchema)
}
