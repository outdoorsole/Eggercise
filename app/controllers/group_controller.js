var path = require('path'),
    bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Group = require('../models/group');

//collections
var Groups = require('../collections/groups');

//------------------------------------------------------------------------------//
//Index
exports.index = function (req,res){
	var groups = Groups;
	groups.fetch()
		 .then(function (data) {
			res.render('index', {title: 'Home', groupId: req.group});
		})
	.catch(function (error){
		console.error(error.stack);
		res.redirect('/error');
	})
};