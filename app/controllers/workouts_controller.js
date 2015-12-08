var path = require('path'),
		bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Workout = require('../models/workout'),
		Group = require('../models/group'),
		Role = require('../models/role'),
		User = require('../models/user');

//collections
var Workouts = require('../collections/workouts');
var Groups = require('../collections/groups');
var Roles = require('../collections/roles');
var Users = require('../collections/users');

//------------------------------------------------------------------------------
//Create workout
exports.logWorkout = function (req,res){
	var userId =req.user.get('id');
	var groupId = req.params.groupId;

	if(req.isAuthenticated()) {
		console.log('made it to logWorkout');
		new Workout({
			user_id: userId,
			group_id: groupId
		}).save()
		.then(function (data) {
			req.method = 'GET';
			res.redirect('/groups/viewgroup/'+groupId)
		})
			.catch(function (error){
				console.error(error.stack);
				res.redirect('/error');
			})
	} else {
		res.render('users/signin');
	}
}
