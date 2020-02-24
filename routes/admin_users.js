const {Admin, validate} = require('../models/admin_users');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    let admin = await Admin.findOne({email: request.body.email});
    if(admin) return response.send('user with this email already existis!');

    admin = new Admin(_.pick(request.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    await admin.save();

    const token = admin.generateAuthToken();
    response.header('x-auth-token', token).send(_.pick(admin, ['_id', 'name', 'email']));
});

module.exports = router;