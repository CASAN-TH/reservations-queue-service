'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    Queue = mongoose.model('Queue'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash'),
    request = require("request"),
    onesignalUrl = process.env.ONESIGNAL_URL || 'https://onesignal.com/api/v1/notifications',
    onesignalApiKey = process.env.ONESIGNAL_API_KEY || 'MDJjNjI1ODEtNzVkYi00NmMxLThiNTgtNzI0NTM2NzEyZmU5',
    onesignalAppID = process.env.ONESIGNAL_APPID || '38dc3697-091e-45b0-bdda-38b302b31e63';

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

exports.create = function (req, res,next) {
    var newQueue = new Queue(req.body);
    newQueue.createby = req.user;
    newQueue.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data;
            next()
            // res.jsonp({
            //     status: 200,
            //     data: data
            // });
        };
    });
};

exports.createNotification = function (req, res, next) {

    //รอ หาไอดีของร้านค้าเพื่อ ที่จะส่งข้อความให้กับร้านๆๆนั้น

    // request({
    //     url: onesignalUrl,
    //     headers: {
    //         'Authorization': 'Basic ' + onesignalApiKey
    //     },
    //     method: 'POST',
    //     json: {
    //         app_id: onesignalAppID,
    //         headings: {
    //             en: 'การจอง'
    //         },
    //         contents: {
    //             en: 'ยืนยันคำสั่งซื้อ' + req.data.orderno + 'สำเร็จ'
    //         },
    //         include_player_ids: userid.ref1,
    //         data: {
    //             type: null
    //         }
    //     }
    // }, function (error, response, body) {
    //     if (error) {
    //         console.log('Error push notification sending messages: ', error);

    //     } else if (response.body.error) {
    //         console.log('Error push notification: ', response.body.error);
    //     }
    // });
    next()
}

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

exports.getTicketHistoryUserFalse = function (req, res, next, id) {

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

exports.getTicketHistoryUserTrue = function (req, res, next, id) {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Queue.find({ user_id: id, status: true }, (err, data) => {
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