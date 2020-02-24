const {Booking, validate} = require('../models/booking');
const {Movie} = require('../models/movie');
const {User} = require('../models/users');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (request, response) => {
    const bookings = await Booking.find().sort('-dateOut');
    response.send(bookings);
});

router.post('/', async (request, response) => {
    const {error} = validate(request.body);
    if(error) return response.send(error.details[0].message);

    const user = await User.findById(request.body.userId);
    if(!user) return response.send('invalid user id provided');

    const movie = await Movie.findById(request.body.movieId);
    if(!movie) return response.send('invalid movie id provided');
    
    if(movie.numberInStock === 0) return response.send('movie is out of stock');

    let book = new Booking({
        user: {
            _id: user._id,
            name: user.name,
            phone: user.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
        .save('bookings', book)
        .update('movies', {_id: movie._id}, {
            $inc: {numberInStock: -1}
        })
        .run();

        response.send(book);
    } catch (error) {
        response.send(error)
    }

});

router.get('/:id', async (request, response) => {
    const booking = await Booking.findById(request.params.id);

    if(!booking) return response.send('invalid id provided');

    response.send(booking);
});

module.exports = router;