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
			res.render('groups/create', {title: 'Your Groups', userId: req.user});
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
		  	// TODO: Jordan. How do you have this setup with no user logged in?
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
	// var groupId = req.params.groupId;
	// var group = new Group({id: groupId});

	// console.log('This is groupId: ', groupId);
	// console.log('This is group: ', group);

	var groups = Groups;
	console.log('This is groups: ', groups);
	groups.fetch()
	.then(function (data) {
		res.render('groups/groups', {
			title: 'Current Groups',
			groups: data.toJSON()
		})
	})
	.catch(function (error) {
		console.log(error.stack);
		res.redirect('/errorpage');
	})
}

// 	group.fetch()
// 	.then(function (data) {
// 		res.render('groups/groups',{
// 			title: 'Current Groups',
// 			groupId: data.get('id')
// 		})
// 	})
// 	.catch(function (error) {
// 		console.log(error.stack);
// 		res.redirect('/errorpage');
// 	});
// }

//------------------------------------------------------------------------------//
//Update
exports.edit = function (req,res) {
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
				res.redirect('/groups');
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
			res.redirect('/groups')
		})
		.catch(function (error){
			console.error(error.stack);
			res.redirect('/error');
		})
	} else {
		res.render('users/signin', {title: 'Sign In'});
	}
}

//------------------------------------------------------------------------------//
//Error page
exports.errorShow = function (req, res) {
	res.render('error');
}
