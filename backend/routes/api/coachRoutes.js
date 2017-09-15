const
    apiResponse = require('express-api-response'),
    coachService = require('../../services/coachService'),
    baseUrl = '/api/coach/';

module.exports = app => {
    app.get(`${baseUrl}testimonial/:id`, (req, res, next) => {
        coachService.getTestimonialsByCoachId(req, (err, data) => {
            if (!data.length) {
                data = [{}];
            }
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.post(`${baseUrl}testimonial`, (req, res, next) => {
        coachService.addTestimonial(req.body, (err, data) => {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.put(`${baseUrl}testimonial/:id`, (req, res, next) => {
        coachService.updateTestimonial(req.params.id, req.body, (err, data) => {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);

    app.delete(`${baseUrl}testimonial/:id`, (req, res, next) => {
        coachService.deleteTestimonial(req.params.id, req.session.passport.user, (err, data) => {
            res.data = data;
            res.err = err;
            next();
        });
    }, apiResponse);
};