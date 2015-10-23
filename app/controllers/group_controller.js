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
			res.render('groups/groups', {title: 'Your Groups', userId: req.user});
		})
	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})
};

//------------------------------------------------------------------------------
//Create
exports.create = function (req,res){
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
