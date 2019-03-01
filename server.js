'use strict';

const app = require('./src/config/app');

app.listen(3011, function () {
    console.log('Start server');
    console.log('Service is running');
});