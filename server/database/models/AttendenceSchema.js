'use strict';
const mongoose = require('mongoose');
const attendenceSchema = new mongoose.Schema({
        gateway_id: String,
        uuids: [],
        response:[],
        lattitude: String,
        longitude: String,
        bearing: String,
        createdOn: { type:Date, default: Date.now,select: false}
    },
    {
        minimize: false,
        versionKey: false
    });

module.exports = {
    'model': mongoose.model('Attendence', attendenceSchema)
}
