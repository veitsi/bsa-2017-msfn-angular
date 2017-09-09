const ApiError = require('./apiErrorService');
const decryptService = require('./decryptService');
const userRepository = require('../repositories/userRepository');
const chatRepository = require('../repositories/chatsRepository');
const chatMessageRepository = require('../repositories/chatMessageRepository');
const socketService = require('../services/socketService');
const cryptojs = require("crypto-js");

function ChatService() {

}

ChatService.prototype.CreateRoom = function(data, callback) {
    const decryptedData = decryptService(data);

    const {senderId, recieverId} = decryptedData;

    chatRepository.add({
        users: [senderId, recieverId],
        room: cryptojs.SHA256(senderId + ' ' + recieverId)
    }, (err, result) => {
        if (err) return callback(err);

        chatRepository.model.populate(result, {path: 'users', select: ['firstName', 'lastName', 'fullName', '_id', 'userPhoto']}, (err, populatedResult) => {
            if (err) return callback(err);

            callback(null, populatedResult);
        })
    });
};

ChatService.prototype.GetRooms = function(data, callback) {
    const decryptedData = decryptService(data);
    const userId = decryptedData.user;

    chatRepository.get({
        filter: {
            isRemoved: false,
            users: {
                $in: [userId]
            }
        },
        unwind: {

        },
        populate: [
            {
                path: 'users',
                select: ['firstName', 'lastName', 'fullName', '_id', 'userPhoto']
            }
        ]
    }, (err, result) => {
        if (err) return callback(err);

        callback(null, result);
    })
};



module.exports = new ChatService();
