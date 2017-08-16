const
    apiResponse = require('express-api-response'),
    measurementService = require('../../services/measurementService'),
    isAdmin = require('../../middleware/isAdminMiddleware'),
    baseUrl = '/api/measurement/';

module.exports = function (app) {

    app.post(baseUrl, function (req, res, next) {
       measurementService.createMeasurement(req.body, function(err, data) {
            res.data = data;
            res.err = err;
            next();
       });
    }, apiResponse);

    app.put(baseUrl, function (req, res, next) { 
        measurementService.updateMeasurement(req.body, function(err, data) {
            res.data = data;
            res.err = err;
            next();
       });
    }, apiResponse);

    app.delete(baseUrl + ':code', function (req, res, next) {
        measurementService.deleteMeasurementByCode(req.params.code, function(err, data) {
            res.err = err;
            res.data = data;
            next();
       });
    }, apiResponse);

    app.get(baseUrl, function (req, res, next) {
            measurementService.getAllMeasurements(function(err, data) {
            if (!data.length){
                data = [];
            }
            res.data = data;
            res.err = err;
            next();
       });
    }, apiResponse);

        app.get(baseUrl + ':code', function (req, res, next) {
            measurementService.getMeasurementByCode(req.params.code, function(err, data) {
            res.data = data;
            res.err = err;
            next();
       });
    }, apiResponse);

        app.get(baseUrl + 'by-name/:name', function (req, res, next) {
            measurementService.getMeasurementByName(req.params.name, function(err, data) {
            res.data = data;
            res.err = err;
            next();
       });
    }, apiResponse);

};
