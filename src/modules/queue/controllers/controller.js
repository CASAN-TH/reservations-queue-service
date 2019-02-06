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
            req.data = {
                queuewait: data.length
            }
            // console.log("getQueue : ", req.find);
            next();
        }
    }).sort('-created')
}
exports.returnData = (req, res) => {
    res.jsonp({
        status: 200,
        data: req.data
    })
}
exports.findByShopId = (req, res, next, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Queue.find({ shop_id: id, status: true }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            // console.log(req.data)
            next();
        };
    }).lean().sort('created');
}

exports.getTicketHistoryUser = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Queue.find({ user_id: id, status: false }, (err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data;
            next();
        }
    }).sort('created')
}

exports.findByQueueId = (req, res, next) => {

    console.log(req.body)

    Queue.findByIdAndUpdate(req.body._id, { status: false, remark: req.body.remark }, { new: true }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(data)

            req.data = data ? data : {};
            next();
        };
    });
}