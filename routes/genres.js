const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (request, response) => {
    let genres = await Genre.find().sort('name');
    response.send(genres);
});

router.post('/', auth, async (request, response) => {
    let {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    let genre = await new Genre({name: request.body.name});
    genre.save();

    response.send(genre);
});

router.put('/:id', async (request, response) => {
    let {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    let genre = await Genre.findByIdAndUpdate(request.params.id, {name: request.body.name}, {new: true});

    if(!genre) return response.send('invalid genre id provided');

    response.send(genre);
});

router.delete('/:id', [auth, admin], async (request, response) => {
    let genre = await Genre.findByIdAndRemove(request.params.id);
    if(!genre) return response.send('invalid genre id given');

    response.send(genre);
});

router.get('/:id', async (request, response) => {
    let genre = await Genre.findById(request.params.id);

    if(!genre) return response.send('invalid genre id provided');

    response.send(genre);
});

module.exports = router;