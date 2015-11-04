var path = require('path'),
		bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Group = require('../models/group'),
	User = require('../models/user'),
	Role = require('../models/role');

//collections
var Groups = require('../collections/groups'),
	Users = require('../collections/users'),
	Roles = require('../collections/roles');

//------------------------------------------------------------------------------//
//Join Group
exports.joinGroup = function (req,res) {
	var userId = req.user.get('id'),
		groupId = req.params.groupId;

	if(req.isAuthenticated()) {
		new Role({
			user_id: userId,
			group_id: groupId,
			is_member: true
		})
		.save()
		.then(function (role){
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
}

//------------------------------------------------------------------------------//
//Leave Group
exports.leaveGroup = function (req,res) {
	var userId = req.user.get('id'),
		groupId = req.params.groupId;

	if(req.isAuthenticated()) {
		new Role({
			user_id: userId,
			group_id: groupId
		})
		.fetch()
		.then(function (role){
			role.destroy()
			res.redirect('/groups/view');
		})
		.catch(function (error){
			console.error(error.stack);
			res.redirect('/errorpage');
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
