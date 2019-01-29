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
                        assert.equal(resp.data.queue, mockup.queue);
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
                assert.equal(resp.data.queue, mockup.queue);
                done();
            });
    });
    it('should be Queue postDetail', (done) => {
        var shop_id = {
            _id: '1234561212',
            user_id: '321456d'
        }
        var queue1 = new Queue({
            queue: '1',
            shop_id: '21231251',
            status: false,
            createby: {
                _id: '12312312311'
            }
        })
        var queue2 = new Queue({
            queue: '2',
            shop_id: '1234561212',
            status: true,
            createby: {
                _id: '321456'
            }
        })
        var queue3 = new Queue({
            queue: '3',
            shop_id: '1234561212',
            status: true,
            createby: {
                _id: '21235646512'
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
                            assert.equal(resp.data.queue, 0);
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
                    queue: 'name update'
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
                        assert.equal(resp.data.queue, update.queue);
                        done();
                    });
            });

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
                    queue: 'name update'
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

    afterEach(function (done) {
        Queue.remove().exec(done);
    });

});