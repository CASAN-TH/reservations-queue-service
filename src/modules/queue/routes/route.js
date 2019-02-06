'use strict';
var controller = require('../controllers/controller'),
    policy = require('../policy/policy');
module.exports = function (app) {
    var url = '/api/queues';
    var urlWithParam = '/api/queues/:queueId';
    app.route(url).all(policy.isAllowed)
        .get(controller.getList)
        .post(controller.create);

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
    app.route('/api/getqueues-user/:userid')
        .get(controller.returnData)
    app.route('/api/queues-update/:_id')
        .put(
            controller.returnData
        )
    app.param('queueId', controller.getByID);
    app.param('id', controller.findByShopId);
    app.param('userid',controller.getTicketHistoryUser);
    app.param('_id', controller.findByQueueId);

}