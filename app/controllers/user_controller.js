var path = require('path'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

//db
var bookshelf = require('../../database/schema');

//models
var User = require('../models/user');

//collections
var Users = require('../collections/users');

//------------------------------------------------------------------------------//
//Index
exports.index = function (req,res){
	var users = Users;
	// var id = req.body.id;
	// var id = req.user;

	// console.log("this is users: "+users);
	// console.log("this is id: "+id);
	//undefined

	// new User({id: id})
	users.fetch()
		 .then(function (data) {
			console.log("this is data: "+data);
			res.render('index', {title: 'Home', user: data.toJSON()});
		})

	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})

	// if(req.isAuthenticated()) {
	// 	var id = req.user;
	// 	new User({id: id})
	// 	.fetch()
	// 	.then(function (data) {
	// 		res.render('index', {title: 'Home', user: data.toJSON()});
	// 	})
	// } else {
	// 	res.redirect('signin');

	// }
};
