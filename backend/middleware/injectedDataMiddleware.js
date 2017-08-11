const fs = require('fs'),
    replaceStream = require('replacestream');

module.exports = function (req, res, obj, error) {
    error = error || false;

    populateInjectData(req.user, function (data) {
        if (req.session && req.session.passport && req.session.passport.user) {
            const user = req.session.passport.user;
            obj.isLoggedIn = true;
            obj.userId = user._id;
            obj.userFirstName = user.firstName;
            obj.userLastName = user.lastName;
            obj.role = user.role;
            obj.currentProject = user.currentProject;
        } else {
            obj.isLoggedIn = false;
        }

        res.header = ('Content-Type', 'text/html');
        fs.createReadStream(__dirname + '/../../dist/' + 'index.html')
            .pipe(replaceStream("[\"data_replace\"]", JSON.stringify(obj).replace(/'/g, "\\'").replace(/\\\"/g, "\\\\\"")))
            .pipe(replaceStream("window._is404Error = false;", "window._is404Error = " + error + ";"))
            .pipe(res);
    });

    function populateInjectData(user, callback_main) {
        callback_main(null, null);
    }
};