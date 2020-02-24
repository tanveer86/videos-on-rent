const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (request, response) => {
    let movies = await Movie.find().sort('name');
    response.send(movies);
});

router.post('/', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    const genre = await Genre.findById(request.body.genreId);
    if(!genre) return response.send('invalid genre id');

    let movie = new Movie({
        title: request.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: request.body.numberInStock,
        dailyRentalRate: request.body.dailyRentalRate
    });

    movie = await movie.save();
    response.send(movie);
});

router.put('/:id', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    const genre = await Genre.findById(request.body.genreId);
    if(!genre) return response.send('invalid genre id provided');

    const movie = await Movie.findByIdAndUpdate(request.params.id, {
        title: request.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: request.body.numberInStock,
        dailyRentalRate: request.body.dailyRentalRate
    }, {new: true});

    if(!movie) return response.send('invalid movie id provided');
    response.send(movie);
});

router.delete('/:id', async (request, response) => {
    const movie = await Movie.findByIdAndRemove(request.params.id);
    if(!movie) return response.send('invalid movie id');

    response.send(movie);
});

router.get('/:id', async (request, response) => {
    const movie = await Movie.findById(request.params.id);
    if(!movie) return response.send('invalid movie id');

    response.send(movie);
});

module.exports = router;