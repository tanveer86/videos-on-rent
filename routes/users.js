const {User, validate} = require('../models/users');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (request, response) => {
    const users = await User.find().sort('name');

    response.send(users);
});

router.post('/', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    let user = new User({
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    });
    user = await user.save();

    response.send(user);
});

router.put('/:id', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    const user = await User.findByIdAndUpdate(request.params.id, {
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    }, {new: true});

    if (!user) return response.send('invalid user id provided');

    response.send(user);
});

router.delete('/:id', async (request, response) => {
    const user = await User.findByIdAndRemove(request.params.id);
    if(!user) return response.send('invalid user id provided');

    response.send(user);
});

router.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    if(!user) return response.send('invalid user id provdied');

    response.send(user);
});

module.exports = router;