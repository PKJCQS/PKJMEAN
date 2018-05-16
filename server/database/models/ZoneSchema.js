'use strict';
const mongoose = require('mongoose');
const zoneSchema = new mongoose.Schema({
        isActive: Boolean,
        name: String,
        zoneType:{type: mongoose.Schema.ObjectId, ref: 'ZoneType'},
        school:{type: mongoose.Schema.ObjectId, ref: 'School'},
        gateway:{type: mongoose.Schema.ObjectId, ref: 'Gateway'},
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
    'model': mongoose.model('Zone', zoneSchema)
}
