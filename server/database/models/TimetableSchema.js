'use strict';
const mongoose = require('mongoose');
const timetableSchema = new mongoose.Schema({
        isActive: Boolean,
        teacher: {type: mongoose.Schema.ObjectId, ref: 'Teacher'},
        school: {type: mongoose.Schema.ObjectId, ref: 'School'},
        classroom: {type: mongoose.Schema.ObjectId, ref: 'Classroom'},
        subject: {type: mongoose.Schema.ObjectId, ref: 'Subject'},
        startTime: String,
        endTime: String,
        comment: String,
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
    'model': mongoose.model('Timetable', timetableSchema)
}
