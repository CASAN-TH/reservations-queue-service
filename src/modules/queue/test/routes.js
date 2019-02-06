'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Queue = mongoose.model('Queue');

var credentials,
    token,
    mockup;

describe('Queue CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            queue: 'name'
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Queue get use token', (done) => {
        request(app)
            .get('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Queue get by id', function (done) {

        request(app)
            .post('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/queues/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.peoples, mockup.peoples);
                        done();
                    });
            });

    });

    it('should be Queue post use token', (done) => {
        request(app)
            .post('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.peoples, mockup.peoples);
                done();
            });
    });



    it('should be Queue postDetail', (done) => {
        var shop_id = {
            _id: '1234561212',
            user_id: '321456'
        }
        var queue1 = new Queue({
            peoples: '11',
            shop_id: '1234561212',
            status: true,
            createby: {
                _id: '321456'
            }
        })
        var queue2 = new Queue({
            peoples: '18',
            shop_id: '1234561212',
            status: true,
            createby: {
                _id: '321456sd'
            }
        })
        var queue3 = new Queue({
            peoples: '10',
            shop_id: '1234561212',
            status: true,
            createby: {
                _id: '321456'
            }
        })
        queue3.save((err, q3) => {
            if (err) {
                return done(err);
            }
            queue2.save((err, q2) => {
                if (err) {
                    return done(err);
                }
                queue1.save((err, q1) => {
                    if (err) {
                        return done(err);
                    }
                    // console.log(q1,q2,q3);
                    request(app)
                        .post('/api/queue-detail')
                        .set('Authorization', 'Bearer ' + token)
                        .send(shop_id)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }
                            var resp = res.body;
                            console.log(resp);
                            assert.equal(resp.data.queuewait, 3);
                            done();
                        });
                })
            })
        })



    });
    it('should be queue put use token', function (done) {

        request(app)
            .post('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    peoples: 'name update'
                }
                request(app)
                    .put('/api/queues/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.peoples, update.peoples);
                        done();
                    });
            });

    });
    it('should be queue update by id', function (done) {
        var queuedata = new Queue({
            peoples: 12,
            shop_id: '1234',
            status: true,
        })
        queuedata.save((err, q1) => {
            if (err) {
                return done(err)
            }
            request(app)
                .put('/api/queues-update/' + queuedata._id)
                .set('Authorization', 'Bearer ' + token)
                .send(queuedata)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    var resp = res.body;
                    assert.equal(resp.data._id, queuedata._id);
                    assert.equal(resp.data.peoples, queuedata.peoples);
                    done();
                });

        })
    });
    it('should be queue delete use token', function (done) {

        request(app)
            .post('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/queues/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be queue get not use token', (done) => {
        request(app)
            .get('/api/queues')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be queue post not use token', function (done) {

        request(app)
            .post('/api/queues')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be queue put not use token', function (done) {

        request(app)
            .post('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    peoples: 'name update'
                }
                request(app)
                    .put('/api/queues/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be queue delete not use token', function (done) {

        request(app)
            .post('/api/queues')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/queues/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });
    xit('should be QueueList get by id', function (done) {
        var dataShop = {
            _id: '123456'
        }
        var queuelist1 = new Queue({
            peoples: '11',
            shop_id: dataShop._id,
            status: true,
            createby: {
                _id: '321456'
            }
        })
        var queuelist2 = new Queue({
            peoples: '8',
            shop_id: dataShop._id,
            status: false,
            createby: {
                _id: '211111'
            }
        })
        queuelist2.save((err, ql2) => {
            if (err) {
                return done(err);
            }
            queuelist1.save((err, ql1) => {
                if (err) {
                    return done(err)
                }
                // console.log(ql1)
                request(app)
                    .get('/api/queues-list/' + dataShop._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        console.log(resp)
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.length, 1);
                        assert.equal(resp.data[0].peoples, queuelist1.peoples);
                        assert.equal(resp.data[0].shop_id, queuelist1.shop_id);
                        assert.equal(resp.data[0].status, queuelist1.status);
                        done();
                    });

            });
        })


    });

    afterEach(function (done) {
        Queue.remove().exec(done);
    });

});