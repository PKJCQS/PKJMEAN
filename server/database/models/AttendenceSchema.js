'use strict';
const mongoose = require('mongoose');
const attendenceSchema = new mongoose.Schema({
        gateway_id: String,
        zone: { type: mongoose.Schema.ObjectId, ref: 'Zone' },
        school_id: {type: mongoose.Schema.ObjectId, ref: 'School'},
        uuids: [],
        response:[],
        lattitude: String,
        longitude: String,
        bearing: String,
        createdOn: Number
    },
    {
        minimize: false,
        versionKey: false
    });

module.exports = {
    'model': mongoose.model('Attendence', attendenceSchema)
}
