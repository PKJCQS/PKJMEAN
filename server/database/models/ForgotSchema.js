'use strict';
const mongoose = require('mongoose');
const fcrgotSchema = new mongoose.Schema({
        email: String,
        username: String,
        userDtl: {},
        otp: String,
        valid: String,
        createdOn: { type:Date, default: Date.now,select: false}
    },
    {
        minimize: false,
        versionKey: false
    });

module.exports = {
    'model': mongoose.model('Forgot', fcrgotSchema)
}
