var bookshelf = require('../../database/schema');
var Workout = require('../models/workout');

//creating Collections
var Workouts = new bookshelf.Collection();

Workouts.model = Workout;

module.exports = Workouts;