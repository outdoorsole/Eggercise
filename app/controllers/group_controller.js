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
	console.log('--------------------');
	console.log('This is req.user.id: ', req.user.id);


	var groupId = req.params.groupId;
	console.log('--------------------');
	console.log('This is req.params.groupId: ', req.params.groupId);

	new Group ({
		id: groupId
	})
	.fetch({
		withRelated: ['users','workouts']
	})
	.then(function (selectedGroup) {
		console.log('--------------------');
		console.log(selectedGroup);

		var numUsers = selectedGroup.relations.users.length;
		console.log('--------------------');
		console.log('This is numUsers: ', numUsers);

		var numWorkouts = selectedGroup.relations.workouts.length;
		console.log('--------------------');
		console.log('This is numWorkouts: ', numWorkouts);

		var currentGroup = selectedGroup.toJSON();
		console.log('--------------------');
		console.log('This is the currentGroup: ', currentGroup);

		var groupData = [];





		// function getGroupData (group) {
		// 	var userId;
		// 	var username;

		// 	for (var i = 0; i < group.workouts.length; i++) {
		// 		userId = group.workouts[i].user_id;
		// 		for (var k = 0; k < groupData.length; k++) {
		// 			if (groupData[k].hasOwnProperty(userId)) {
		// 				for (var j = 0; j < group.users.length; j++) {
		// 					if (userId === group.users[j].id) {
		// 						username = group.users[j].username;
		// 						groupData.push({
		// 							userId: userId,
		// 							username: username,
		// 							totalWorkouts: 1
		// 						});
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		// getGroupData(currentGroup);
		// console.log('--------------------');
		// console.log('This is the groupData: ', groupData);

		// function getUserWorkouts (workouts, users, userId) {
		// 	var filteredGroups = [];

		// 	console.log('This is workouts: ', workouts);
		// 	console.log('This is users: ', users);
		// 	console.log('This is the userId: ', userId);
		// 	var totalWorkouts = 0;

		// 	for (var i = 0; i < numWorkouts; i++) {
		// 		if (userId === workouts[i].user_id) {
		// 			if (!filteredGroups[0].userId) {
		// 				console.log('This is userId: ', userId);
		// 				console.log('This is trying to get username: ', users.indexOf(id.userId));
		// 				filteredGroups.push({
		// 					userId: userId,
		// 					username: users.indexOf(userId),
		// 					totalWorkouts: totalWorkouts
		// 				});
		// 			}
		// 			totalWorkouts++;
		// 		}
		// 	}
		// 	return filteredGroups;
		// }

		// function getUserWorkouts (group) {
		// 	for (var i = 0; i < group.workouts.length; i++) {
		// 		if (group.workouts[i].user_id === req.user.id)
		// 			filteredGroups.push(group.workouts[i]);
		// 	}
		// 	return filteredGroups;
		// }

		function getUserWorkouts (group, userId) {
			console.log('This is userId', userId);
			var result = group.map(function(object) {
				var totalWorkouts = 0;
				console.log("this is the result of truthy", object['user_id'] === userId);
				if (object['user_id'] === userId) {
					totalWorkouts++;
					console.log('This is inside if statement');
					console.log('This is totalWorkouts: ', totalWorkouts);
				}
				return totalWorkouts;
			});
			return result;
		}

		var userWorkoutsUser1 = getUserWorkouts(currentGroup.workouts, 1).reduce(function (prev, current) {
			return prev + current;
		});
		var userWorkoutsUser2 = getUserWorkouts(currentGroup.workouts, 2).reduce(function (prev, current) {
			return prev + current;
		});
		var userWorkoutsUser3 = getUserWorkouts(currentGroup.workouts, 3).reduce(function (prev, current) {
			return prev + current;
		});
		// var userWorkoutsUser2 = getUserWorkouts(currentGroup.workouts, 2);
	// var userWorkoutsUser1 = getUserWorkouts(currentGroup.workouts, currentGroup.users, 1)
	// var userWorkoutsUser2 = getUserWorkouts(currentGroup.workouts, currentGroup.users, 2)
	// var userWorkoutsUser3 = getUserWorkouts(currentGroup.workouts, currentGroup.users, 3)

	var userWorkoutsForUser1 = [userWorkoutsUser1];
	var userWorkoutsForUser2 = [userWorkoutsUser2];
	var userWorkoutsForUser3 = [userWorkoutsUser3];
	var userWorkouts = [userWorkoutsUser1, userWorkoutsUser2, userWorkoutsUser3];
	// console.log('--------------------');
	// console.log('This is the userWorkoutsUser1: ', userWorkoutsUser1);
	// console.log('--------------------');
	// console.log('This is the userWorkoutsUser2: ', userWorkoutsUser2);
	// console.log('--------------------');
	// console.log('This is the userWorkoutsUser3: ', userWorkoutsUser3);
	console.log('--------------------');
	console.log('This is the userWorkouts: ', userWorkouts);
	var groupMembers = [];

	function getUsers (group) {
		for (var i = 0; i < group.users.length; i++) {
			groupMembers.push(group.users[i]);
		}
	}

	getUsers(currentGroup);
	console.log('--------------------');
	console.log('These are the users in the group: ', groupMembers);


	// var accumulator = 0;

	// Pseudocode for accumulating the number of workouts for each user
	// Input workouts array
	// Output aggregated workouts array ('rollups')
	// Var outputArray = [];
	// Create the output array that contains: an array of {user_id and total worksouts}
	// Loop through the array (workout array) - store the first object in x
	//    If (user id does not exists in the outputArray)
	//			y will be equal to the username
	//				Iterate through the users array and find the user id to get the username
	//				(optimization - google this: search an array of objects based on key/value pair)
	//      outputArray.push({ y, x.workoutTotal: 1 });
	//    Else
	//			Find the user and store it in a variable
	//      increment the workoutTotal for the existing user_id in the outputArray
	// After the loop has completed by iterating through all the objects in workouts (x), return outputArray





		res.render('groups/viewgroup', {
			group: currentGroup,
			groupMembers: groupMembers,
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
