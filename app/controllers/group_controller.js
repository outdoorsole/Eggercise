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
	console.log('This is req.user.id: ', req.user.id);
	console.log('--------------------');
	var groupId = req.params.groupId;
	new Group ({
		id: groupId
	})
	.fetch({
		withRelated: ['users','workouts']
	})
	.then(function (allGroups) {
		console.log(allGroups.toJSON());
		console.log('--------------------');
		var allGroupstoJSON = allGroups.toJSON();
		console.log(allGroupstoJSON);
		console.log('--------------------');

	var filteredGroups = [];

		function getUserWorkouts (group) {
			for (var i = 0; i < group.workouts.length; i++) {
				if (group.workouts[i].user_id === req.user.id)
					console.log('This worked');
					filteredGroups.push(group.workouts[i]);
			}
			return filteredGroups;
		}

	var userWorkouts = getUserWorkouts(allGroupstoJSON);
	console.log('This is the userWorkouts: ', userWorkouts);


		// function userWorkouts(group) {
		// 	for (var i = 0; i < group.users.length; i++) {
		// 		if (group.users[0].id == group.workouts[i].user_id) {
		// 			console.log('userWorkouts: ', group.workouts[i]);
		// 			console.log('--------------------');
		// 			return group.workouts[i];
		// 		}
		// 	}
		// }
		// var filtered = [allGroupstoJSON].filter(userWorkouts);
		// console.log('filtered: ', filtered);
		// console.log('--------------------');

		res.render('groups/viewgroup', {
			group: allGroups.toJSON(),
			users: allGroups.toJSON().users,
			workouts: userWorkouts,
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
