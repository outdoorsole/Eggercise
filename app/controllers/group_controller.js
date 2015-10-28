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

//------------------------------------------------------------------------------
//Index
exports.index = function (req,res){
	var groups = Groups;
	groups.fetch({id: req.body.id})
		 .then(function (data) {
			res.render('groups/create', {title: 'Your Groups', userId: req.user.get('id'), username: req.user.get('username')});
		})
	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})
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
		  		is_admin: true
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
			res.render('users/signin', {title: 'Sign Up'});
	}

}

//------------------------------------------------------------------------------//
//Show
exports.show = function (req,res) {
	var groups = Groups;
	groups.fetch()
	.then(function (data) {
		res.render('groups/groups', {
			title: 'Current Groups', 
			groups: data.toJSON(), 
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
				title: 'Edit Group', 
				group: group.toJSON(), 
				userId: req.user.get('id'), 
				username: req.user.get('username')
			})
		} else {
			res.render('users/signin', {title: 'Sign Up',  userId: req.user.get('id'), username: req.user.get('username')});
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
			res.render('users/signin', {title: 'Sign Up'});
		}
	})
}


//------------------------------------------------------------------------------//
//Delete
exports.destroy = function (req,res) {
	if(req.isAuthenticated()) {
		var groupId = req.params.groupId;
		new Group({id: groupId})
		.fetch()
		.then(function (group) {
			group.destroy()
			req.method = 'GET'
			res.redirect('/groups/view')
		})
		.catch(function (error){
			console.error(error.stack);
			res.redirect('/error');
		})
	} else {
		res.render('users/signin', {title: 'Sign In', userId: req.user.get('id'), username: req.user.get('username')});
	}
}

//------------------------------------------------------------------------------//
//Error page
exports.errorShow = function (req, res) {
	res.render('error');
}
