const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        minlength: 6,
        maxlength: 12
    }
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().min(4).max(100).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(6).max(12)
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;