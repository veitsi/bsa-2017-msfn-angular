const ApiError = require('./apiErrorService'),
    tribeRepository = require('../repositories/tribeRepository');

function TribeService() {}

TribeService.prototype.createTribe = createTribe;
TribeService.prototype.getAllTribes = getAllTribes;
TribeService.prototype.updateTribeById = updateTribeById;
TribeService.prototype.getApplicants = getApplicants;
TribeService.prototype.getTribeById = getTribeById;
TribeService.prototype.getFollowed = getFollowed;
TribeService.prototype.getTribesByCreatorId = getTribesByCreatorId;
TribeService.prototype.addFollowers = addFollowers;


function createTribe(body, callback) {
    body.isRemoved = false;
    tribeRepository.add(body, function (err, tribeData) {
        if (err) return callback(err);
        if (tribeData === null) {
            callback(null, new ApiError('Cannot create tribe'));
        } else {
            callback(null, tribeData);
        }
    });
}

function getApplicants(category, body, callback) {
    const tribeId = body.params.id;
    tribeRepository.getApplicants(category, tribeId, (err, data) => {
        callback(err, data);
    });
}

function getAllTribes(callback) {
    tribeRepository.getAll(function (err, tribeData) {
        if (err) return callback(err);
        if (tribeData === null) {
            callback(null, new ApiError('Cannot find tribes'));
        } else {
            callback(null, tribeData);
        }
    });
}

function updateTribeById(id, body, callback) {
    tribeRepository.update(id, body, callback);
}

function getTribeById(id, callback) {
    tribeRepository.getById(id, function (err, tribeData) {
        console.log(tribeData);
        if (err) return callback(err);
        if (tribeData === null) {
            callback(null, new ApiError('Cannot get tribe'));
        } else {
            callback(null, tribeData);
        }
    });
}

function getTribesByCreatorId(creator, callback) {
    tribeRepository.getByCreatorId(creator, function (err, tribeData) {
        if (err) return callback(err);
        if (tribeData === null) {
            callback(null, new ApiError('Cannot find tribes'));
        } else {
            callback(null, tribeData);
        }
    });
}

function addFollowers(id, userId, callback) {
    tribeRepository.addFollowers(id, userId, (err, data) => {
        if (err) return callback(err);
        if (data === null) {
            callback(null, new ApiError('Cannot add follower'));
        } else {
            callback(null, data);
        }
    });
}

function getFollowed(id, callback) {
    tribeRepository.getFollowed(id, (err, tribeData) => {
        if (err) return callback(err);
        if (tribeData === null) {
            callback(null, new ApiError('Cannot get tribes'));
        } else {
            callback(null, tribeData);
        }
    });
}


module.exports = new TribeService();
