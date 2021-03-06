var path = require('path'),
	bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Group = require('../models/group'),
		Role = require('../models/role'),
		User = require('../models/user');

//collections
var Groups = require('../collections/groups');
var Roles = require('../collections/roles');
var Users = require('../collections/users');

//------------------------------------------------------------------------------
//Index
exports.index = function (req,res){
	var groups = Groups;

	if(req.isAuthenticated()){
		groups.fetch({id: req.body.id})
		.then(function (data) {
			res.render('groups/create', {
				userId: req.user.get('id'),
				username: req.user.get('username')
			});
		})
		.catch(function (error){
			console.error(error.stack);
			res.redirect('/error');
		})
	} else {
		res.render('users/signin');
	}
};

//------------------------------------------------------------------------------
//Create
exports.create = function (req,res){
	var userId;

	if(req.isAuthenticated()) {
		new Group({
			name: req.body.name,
			price: req.body.price
		}).save()
		.then(function (group) {
			userId = req.user.get('id');
			groupId = group.get('id');
			new Role({
				user_id: userId,
				group_id: groupId,
				is_admin: true,
				is_member: true
			}).save()
			.then(function (roleData) {
				res.redirect('/')
				})
			})
			.catch(function (error){
				console.error(error.stack);
				res.redirect('/error');
			})
	} else {
		res.render('users/signin');
	}
}

//------------------------------------------------------------------------------//
//Show Groups List
exports.show = function (req,res) {
	var userId = req.user.get('id');
	User.forge({
		id: userId
	})
	.fetch({
		withRelated: ['groups']
	})
	.then(function (data) {
		Groups
		//call query builder, bypass bookshelf
		.query(function (qb){
			qb.whereNotExists(function (){
				this.select('*').from('roles').whereRaw('roles.group_id = groups.id and roles.user_id='+userId)
			})
		})
		.fetch()
		.then(function (groups) {
			res.render('groups/groups', {
				users: data.toJSON(),
				groups: groups.toJSON(),
				// userId and username always needed for navbar
				userId: req.user.get('id'),
				username: req.user.get('username')
			})
		})
	})
	.catch(function (error) {
		console.log(error.stack);
		res.redirect('/errorpage');
	})
}

//------------------------------------------------------------------------------//
//Show Single Group
exports.showGroup = function (req,res) {
	var groupId = req.params.groupId;

	new Group ({
		id: groupId
	})
	.fetch({
		withRelated: ['users','workouts']
	})
	.then(function (selectedGroup) {
		// Store the total group members for selected group
		var numUsers = selectedGroup.relations.users.length;

		// Store the total number of workouts for the currently selected group
		var numWorkouts = selectedGroup.relations.workouts.length;

		// Store the selected group object information in JSON format
		var currentGroup = selectedGroup.toJSON();

		// Store the workouts for the currently selected group
		var currentGroupWorkouts = currentGroup.workouts;

		// Store the users (groupMembers) for the currently selected group
		var groupMembers = currentGroup.users;

		// Initialize variable to store workout totals for each group member
		var userWorkouts = [];

		// Store the result for the total workouts for each member
		var currentUserTotal;

		// Invoking the getUserWorkouts function for all the users (group Members) to get the total number of workouts
		for (var num = 1; num <= numUsers; num++) {
			currentUserTotal = getUserWorkouts(currentGroupWorkouts, num);
			userWorkouts.push(currentUserTotal);
		}

		// Will accumulate the total number of workouts for each user and return the result
		function getUserWorkouts (loggedWorkouts, userId) {
			var totalWorkouts = 0;
			var result = loggedWorkouts.map(function(workout) {
				if (workout['user_id'] === userId) {
					totalWorkouts++;
				}
				return totalWorkouts;
			});
			// To only get the last element of the array (workout total)
			result = result[result.length-1];
			return result;
		}

		res.render('groups/viewgroup', {
			group: currentGroup,
			groupMembers: groupMembers,
			workouts: numWorkouts,
			userWorkouts: userWorkouts,
			userId: req.user.get('id'),
			username: req.user.get('username')
		})
	})
	.catch(function (error) {
		console.log(error.stack);
		res.redirect('/errorpage');
	})
}

//------------------------------------------------------------------------------//
//Update Get
exports.editShow = function (req,res) {
	var groupId = req.params.groupId;
	new Group({
		id: groupId
	})
	.fetch()
	.then(function (group) {
		if(req.isAuthenticated()) {
			res.render('groups/edit', {
				group: group.toJSON(),
				userId: req.user.get('id'),
				username: req.user.get('username')
			})
		} else {
			res.render('users/signin');
		}
	})
	.catch(function (error){
		console.error(error.stack);
		res.redirect('/errorpage');
	})
}


//------------------------------------------------------------------------------//
//Update Post
exports.editPost = function (req,res) {
	var groupId = req.params.groupId;

	new Group({
		id: groupId
	})
	.fetch()
	.then(function (group) {
		if(req.isAuthenticated()) {
			group.save({
				name: req.body.name || group.get('name'),
				price: req.body.price || group.get('price')
			})
			.then(function (group){
				req.method = 'GET';
				res.redirect('/groups/view');
			})
			.catch(function (error){
				console.error(error.stack);
				res.redirect('/errorpage');
			})
		} else {
			res.render('users/signin');
		}
	})
}


//------------------------------------------------------------------------------//
//Delete
exports.destroy = function (req,res) {
	if(req.isAuthenticated()) {
		var groupId = req.params.groupId;

		new Group({
			id: groupId
		})
		.fetch({
			withRelated: ['roles','workouts']
		})
		.then(function (group) {
			group.related('roles','workouts')
			.invokeThen('destroy')
			.then(function () {
				group.destroy()
				.then(function(){
					req.method = 'GET';
					res.redirect('/groups/view');
				})
			})
		})
		.catch(function (error){
			console.error(error.stack);
			res.redirect('/error');
		})
	} else {
		res.render('users/signin');
	}
}

//------------------------------------------------------------------------------//
//Error page
exports.errorShow = function (req, res) {
	res.render('error');
}
