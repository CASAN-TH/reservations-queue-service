'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    Queue = mongoose.model('Queue'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    Queue.find(function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.create = function (req, res) {
    var newQueue = new Queue(req.body);
    newQueue.createby = req.user;
    newQueue.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Queue.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updQueue = _.extend(req.data, req.body);
    updQueue.updated = new Date();
    updQueue.updateby = req.user;
    updQueue.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};
exports.getQueue = (req, res, next) => {
    var shop_id = req.body._id
    // console.log(req.body._id);
    Queue.find({ shop_id: shop_id, status: true }, (err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log("getQueue : ", data);
            req.find = data
            next();
        }
    })
}
exports.sortQueue = (req, res, next) => {
    var dataSort = req.find.sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
    })
    req.sortDataQueue = dataSort
    console.log("sortQueue : ", req.sortDataQueue);
    next();
}
exports.cookigQueue = (req, res, next) => {
    var userId = req.body.user_id
    // var userId = req.user._id
    console.log(userId)

    var index = req.sortDataQueue.findIndex( function (o) {
        return o.createby._id.toString() == userId;
    });
    console.log("cookigQueue : ", index + 1)
    req.dataQueue = {
        queue: index + 1
    }
    next();
}
exports.returnData = (req, res) => {
    res.jsonp({
        status: 200,
        data: req.dataQueue
    })
}