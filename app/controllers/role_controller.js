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
//Join GET
exports.joinGroupGet = function (req,res) {
	var userId = req.user.get('id'),
		groupId = req.params.groupId

	new Role({
		user_id: userId,
	})
	.fetch()
	.then(function (role) {
		if(req.isAuthenticated()) {
			res.redirect('/groups/view');
			// role.save({
			// 	is_admin: false
			// })
			// .then(function (role){

			// })

			// .catch(function (error){
			// 	console.error(error.stack);
			// 	res.redirect('/errorpage');
		} else {
			res.render('users/signin', {
				title: 'Sign Up'
			});
		}
	})
	.catch(function (error){
		console.error(error.stack);
		res.redirect('/errorpage');
	})
}

//------------------------------------------------------------------------------//
//Join POST
exports.joinGroupPost = function (req,res) {
	var userId = req.user.get('id');

	new Role({
		user_id: userId,
	})
	.fetch()
	.then(function (role){
		if(req.isAuthenticated()){
			role.save({
				is_admin: false
			})
			.then(function (role){
				console.log('This is userId '+userId);
				req.method = 'GET';
				res.redirect('/groups/view');
			})
			.catch(function (error){
				console.error(error.stack);
				res.redirect('/errorpage');
			})
		} else {
			res.render('users/signin', {
				title: 'Sign Up'
			});
		}
	})
}

//------------------------------------------------------------------------------//
//Error page
exports.errorShow = function (req, res) {
	res.render('error');
}