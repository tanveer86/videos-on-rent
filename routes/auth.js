const {Admin} = require('../models/admin_users');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    let admin = await Admin.findOne({email: request.body.email});
    if(!admin) return response.send('invalid email id');

    const validPassword = await bcrypt.compare(request.body.password, admin.password);
    if(!validPassword) return response.send('wrong password!');

    const token = admin.generateAuthToken();
    response.send(token)
})

function validate(request){
    const schema = {
        email: Joi.string().min(3).max(500).required().email(),
        password: Joi.string().min(3).max(500).required()
    }

    return Joi.validate(request, schema);
}

module.exports = router;