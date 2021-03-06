const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const TrainingPlan = new Schema({
    name: String,
    count: Number,
    days: Array,
    exercisesList: [
        {
            sets: [{
                value: String,
                value2: String
            }],
            exercise: {
                type: ObjectId,
                ref: 'Exercise'
            },
        }
    ],
    intervals: [
        {
            exList: Array,
            lapTime: Number,
            warmTime: Number,
            name: String
        }
    ],
    trainingType: 'general' | 'interval',
    userID: ObjectId,
    description: String,
    shared: Boolean,
    gcalendar_id: String,
    isRemoved: {
        type: Boolean,
        default: false
    },
    additional: {
        author: {
            type: ObjectId,
            ref: 'User'
        },
        date: {
            type: Date
        }
    }
});

module.exports = mongoose.model('TrainingPlan', TrainingPlan);
