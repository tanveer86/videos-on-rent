const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Joi = require('joi');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const users = require('./routes/users');
const bookings = require('./routes/bookings');
const admin_user = require('./routes/admin_users');
const auth = require('./routes/auth');
const config = require('config');

if(!config.get('jwtPrivateKey')){
    console.log('jwt key is not defiened');
    process.exit(1);
}

mongoose.connect('mongodb://127.0.0.1:27017/videorent')
.then(() => console.log('connected to mongodb database'))
.catch(error => console.log(error))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/bookings', bookings);
app.use('/api/admin', admin_user);
app.use('/api/auth', auth);

app.listen(5000, () => console.log('connected to server on 5000'));