const Repository = require('./generalRepository'),
        User = require('../schemas/userSchema');

function UserRepository() {
    Repository.prototype.constructor.call(this);
    this.model = User;
}

UserRepository.prototype = new Repository();

UserRepository.prototype.getUserByEmail = getUserByEmail;
UserRepository.prototype.findById = findById;
UserRepository.prototype.getUserByQuery = getUserByQuery;
UserRepository.prototype.addEmail = addEmail;

function getUserByEmail(email, callback) {
    const query = this.model.findOne({email : email});
    query.exec(callback);
}

function findById(id, callback) {
    const query = this.model.findOne({_id : id});
    query.exec(callback);
}
function getUserByQuery(query, callback) {
    const innerQuery = this.model.findOne(query);
    innerQuery.exec(callback);
}

function addEmail(id, email, callback) {
    const query = this
        .model
        .update({
            _id: id
        }, {
            $addToSet: {
                secondaryEmails: email
            }
        });
    query.exec(callback);
}

module.exports = new UserRepository();
