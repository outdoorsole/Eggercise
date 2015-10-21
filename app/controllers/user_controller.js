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
	if(req.isAuthenticated()) {
		var id = req.user;
		new User({id: id})
		.fetch()
		.then(function (data) {
			res.render('index', {title: 'Home', user: data.toJSON()});
		})
	} else {
		res.redirect('signin');

	}
};
