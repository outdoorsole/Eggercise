var path = require('path'),
    bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Group = require('../models/group');

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
	console.log('This is req.body.name: ', req.body.name);
	console.log('This is req.body.price: ', req.body.price);
	new Group({
		name: req.body.name,
		price: req.body.price
	}).save()
	  .then(function (group) {
	  	res.redirect('/')
	  })

	  .catch(function (error){
	  	console.error(error.stack);
	  	res.redirect('/error');
	  })
}

//------------------------------------------------------------------------------//
//Update
exports.edit = function (req,res) {
	var groupId = req.params.groupId;
	// var user = new User({id: userId})
	console.log('groupId in group controller: '+groupId);

	new Group({
		id: groupId
	})
	.fetch()
	.then(function (group) {
		console.log('reached promise');
		// if(req.isAuthenticated()) {
			console.log('is authenticated');
			group.save({
				name: req.body.name || group.get('name'),
				price: req.body.price || group.get('price')
			})
			.then(function (group){
				console.log('This is req.body.name: '+req.body.name);
				req.method = 'GET';
				res.redirect('/');
			})
			.catch(function (error){
				console.error(error.stack);
				res.redirect('/errorpage');
			})
		// } else {
		// 	res.render('users/signup', {title: 'Sign Up'});
		// }
	})
}

//------------------------------------------------------------------------------//
//Show Group
// exports.show = function (req,res) {
// 	var groupId = req.params.id;
// 	var group = new Group({id: groupId});

// 	// user.fetch({
// 	// 	withRelated:['roles']
// 	// })
// 	group.fetch()
// 	.then(function (data) {
// 		console.log('This is data: ', data);
// 		res.render('groups/groups',{
// 			title: 'Current Groups',
// 			data: data.toJSON()
// 		})
// 	})
// 	.catch(function (error) {
// 		console.log(error.stack);
// 		res.redirect('/errorpage');
// 	});
// }

//------------------------------------------------------------------------------//
//Error page
exports.errorShow = function (req, res) {
	res.render('error');
}
