const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Booking = mongoose.model('Booking', new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 100
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 12
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 150
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 500
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateRequired: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateBooking(booking) {
    const schema = {
        userId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(booking, schema);
}

exports.Booking = Booking;
exports.validate = validateBooking;