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
	users.fetch()
		 .then(function (data) {
			console.log("this is data: "+data);
			res.render('index', {title: 'Home', user: data.toJSON()});
		})

	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})
};

//------------------------------------------------------------------------------//
//Sign Up GET (Create User)
exports.signUpGet = function(req, res) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/signup', {title: 'Sign Up'});
	}
}

//------------------------------------------------------------------------------//
//Sign Up POST (Create User)
exports.signUpPost = function (req,res) {
	var password = req.body.password,
		salt = bcrypt.genSaltSync(10),
		hash = bcrypt.hashSync(password,salt);

	new User({
		username: req.body.username,
		password: hash
	}).save()
	  .then(function (user) {
			res.redirect('/')
	  })

	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})
}