'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var QueueSchema = new Schema({
    peoples: {
        type: String
    },
    remark:{
        type:String
    },
    user_id:{
        type:String
    },
    shop_id: {
        type: String
    },
    status: {
        type: Boolean
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Queue", QueueSchema);