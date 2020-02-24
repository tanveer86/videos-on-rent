const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    isAdmin: Boolean
});

adminSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const Admin = mongoose.model('Admin', adminSchema);

function validateAdmin(admin) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(500).required().email(),
        password: Joi.string().min(3).max(500).required(),
        isAdmin: Joi.boolean()
    }

    return Joi.validate(admin, schema);
}

exports.Admin = Admin;
exports.validate = validateAdmin;