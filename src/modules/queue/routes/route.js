'use strict';
var controller = require('../controllers/controller'),
    policy = require('../policy/policy');
module.exports = function (app) {
    var url = '/api/queues';
    var urlWithParam = '/api/queues/:queueId';
    app.route(url).all(policy.isAllowed)
        .get(controller.getList)
        .post(
            controller.create,
            controller.createNotification,
            controller.returnData
            );

    app.route(urlWithParam).all(policy.isAllowed)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.delete);
    app.route('/api/queue-detail')
        .post(
            controller.getQueue,
            controller.returnData
        )
    app.route('/api/queues-list/:id')
        .get(
            controller.returnData
        )
    app.route('/api/queues-user/:userid')
        .get(controller.returnData)

    app.route('/api/queues-usertrue/:useridtrue')
        .get(controller.returnData)

    app.route('/api/queues-update/')
        .post(
            controller.findByQueueId,
            controller.returnData
        )
    app.param('queueId', controller.getByID);
    app.param('id', controller.findByShopId);
    app.param('userid', controller.getTicketHistoryUserFalse);
    app.param('useridtrue', controller.getTicketHistoryUserTrue);

}