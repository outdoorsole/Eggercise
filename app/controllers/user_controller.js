var path = require('path'),
		bodyParser = require('body-parser'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		bcrypt = require('bcrypt-nodejs');

//db
var bookshelf = require('../../database/schema');

//models
var User = require('../models/user');
var Role = require('../models/role');

//collections
var Users = require('../collections/users');
var Roles = require('../collections/roles');

//------------------------------------------------------------------------------//
//Index
exports.index = function (req,res){
	if (req.isAuthenticated()) {
				res.render('index', {
					userId: req.user.get('id'),
					username: req.user.get('username')
				});
	}	else	{
		res.render('index')
	}
};

//------------------------------------------------------------------------------//
//Sign Up GET (Create User)
exports.signUpGet = function(req, res) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/signup');
	}
}

//------------------------------------------------------------------------------//
//Sign Up POST (Create User)
exports.signUpPost = function (req,res) {
	console.log(req.body);
	var password = req.body.password,
		salt = bcrypt.genSaltSync(10),
		hash = bcrypt.hashSync(password,salt);

	new User({
		username: req.body.username,
		password: hash,
		email:req.body.email
	})
	.save()
	.then(function (data){
		User.forge({
			username: req.body.username
		})
		var id = data.get('id');
		new Role({
			is_member: false,
			user_id: id
		})
		.save()
		.then(function (user) {
			res.redirect('/signin')
		})
		.catch(function (error){
			console.error(error.stack);
			res.redirect('/errorpage');
		});
	})
	.catch(function (error){
		console.error(error.stack);
		res.redirect('/errorpage');
	});
}

//------------------------------------------------------------------------------//
//Sign In GET
exports.signInGet = function (req,res) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	}
	res.render('users/signin');
};

//------------------------------------------------------------------------------//
//Sign In POST
exports.signInPost = function (req,res,next) {
	passport.authenticate('local', {
		failureRedirect:'/signin'
	}, function (err,user,info) {
		req.logIn(user, function (err) {
			if(err) {
				console.log(err + " Fail");
				res.render('error', {
					title: 'Sign In Fail',
					errorMessage: err.message
				});
			} else {
				res.redirect('/');
			}
		});
	})(req,res,next);
};

//------------------------------------------------------------------------------//
//Sign Out
exports.signOut = function(req,res,next) {
	if(!req.isAuthenticated()) {
		res.render('index')
	} else {
		req.logout();
		res.redirect('/')
	}
}

//------------------------------------------------------------------------------//
//Show User
exports.show = function (req,res) {
	var userId = req.params.id;
	var user = new User({id: userId});

	user.fetch()
	.then(function (data) {
		res.render('users/edit', {
			userId: req.user.get('id'),
			username: req.user.get('username')
		})
	})
	.catch(function (error) {
		console.log(error.stack);
		res.redirect('/errorpage');
	});
}

//------------------------------------------------------------------------------//
//Update User (e-mail and password)
exports.edit = function (req,res) {
	var userId = req.params.id;
	var password = req.body.password,
		salt = bcrypt.genSaltSync(10),
		hash = bcrypt.hashSync(password,salt);

	new User({
		id: userId
	})
	.fetch()
	.then(function (user) {
		if(req.isAuthenticated()) {
			user.save({
				email: req.body.email || user.get(
					'email'),
				password: hash || user.get('password')
			})
			.then(function (user){
				req.method = 'GET';
				res.redirect('/');
			})
			.catch(function (error){
				console.error(error.stack);
				res.redirect('/errorpage');
			})
		} else {
			res.render('users/signup');
		}
	})
}


//------------------------------------------------------------------------------//
//Error page
exports.errorShow = function (req, res) {
	res.render('error');
}
