const
    apiResponse = require('express-api-response'),
    userService = require('../../services/userService'),
    userRepository = require('../../repositories/userRepository'),
    baseUrl = '/api/user/',
    subscribeRoutes = require('./subscribeRoutes'),
    activateRoutes = require('./activateRoutes'),
    changeMailRoutes = require('./changeMailRoutes');

module.exports = function (app) {
    app.get(baseUrl + 'me', function (req, res, next) {
        res.data = req.session.user;
        next();
    }, apiResponse);

    app.use(baseUrl + 'activate', activateRoutes);

    app.use(baseUrl + 'changemail', changeMailRoutes);

    app.get(baseUrl, function (req, res, next) {
        userRepository.getAll(function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.get(baseUrl + ':id', function (req, res, next) {
        userRepository.getById(req.params.id, function (err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.post(baseUrl, function (req, res, next) {
        userService.addItem(req.body, function (err, data) {
            res.data = {
                "registered": "true"
            };
            res.err = err;
            next();
        });
    }, apiResponse);

    app.put(baseUrl + 'secondaryEmail/:id', function (req, res, next) {
        userService.addEmailToItem(req.params.id, req.body, function (err, data) {

            res.data = {
                addedEmail: req.body.newSecondaryEmail,
                status: 'ok'
            };
            res.err = err;
            next();
        });
    }, apiResponse);


    app.put(baseUrl + ':id', function(req, res, next) {
        userService.updateItem(req.params.id, req.body, function(err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.use(baseUrl + 'subscribe', subscribeRoutes);

    app.delete(baseUrl + ':id', function(req, res, next) {
        userRepository.deleteById(req.params.id, function(err, data) {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

};
