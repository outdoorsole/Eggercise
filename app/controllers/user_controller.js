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

//authenticate passport function
// function authenticate (req,next){
// 	if(req.isAuthenticated()){
// 		next();
// 	} else {
// 		req.redirect('/')
// 	}
// }

// app.use(authenticate);

//------------------------------------------------------------------------------//
//Index
exports.index = function (req,res){
	var users = Users;
	users.fetch()
		 .then(function (data) {
			res.render('index', {title: 'Home', userId: req.user});
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
		password: hash,
		email:req.body.email
	}).save()
	  .then(function (user) {
			res.redirect('/')
	  })

	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})
}

//------------------------------------------------------------------------------//
//Sign In GET
exports.signInGet = function (req,res) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	}
	res.render('users/signin', {title: 'Sign In'});
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
				res.render('users/signin', {title: 'Sign In Fail', errorMessage: err.message});
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

	console.log('This is req in the user controller show: ', req);
	console.log('---------------');
	console.log('This is res in the user controller show: ', res);
	console.log('---------------');
	console.log('This is userId: ', userId);
	console.log('---------------');
	console.log('This is user: ', user);
	console.log('---------------');

	// user.fetch({
	// 	withRelated:['roles']
	// })
	user.fetch()
	.then(function (data) {
		console.log('This is data: ', data);
		res.render('users/edit',{
			title: 'Current User',
			data: data.toJSON()
		})
	})
	.catch(function (error) {
		console.log(error.stack);
		res.redirect('/error');
	});
}

//------------------------------------------------------------------------------//
//Update User (e-mail and password)
exports.edit = function (req,res) {
	var userId = req.params.id;
	var password = req.body.password,
		salt = bcrypt.genSaltSync(10),
		hash = bcrypt.hashSync(password,salt);

	if(req.isAuthenticated()) {
		new User({
			id: userId
		})
		.save({
			'email': req.body.email || user.get('email'),
			'password': hash || user.get('password')
		})
		.then(function (user){
			req.method = 'GET';
			res.redirect('/');
		})

		.catch(function (error){
			console.error(error.stack);
			res.redirect('/error');
		})
	} else {
		res.render('users/signup', {title: 'Sign Up'});
	}
}

