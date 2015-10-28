var path = require('path'),
    bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Group = require('../models/group'),
	User = require('../models/user'),
	Role = require('../models/role');

//collections
var Groups = require('../collections/groups'),
	Users = require('../collections/users'),
	Roles = require('../collections/roles');

//------------------------------------------------------------------------------//
//Join
exports.joinGroup = function (req,res) {
	var userId = req.user.get('id');

	if(req.isAuthenticated()) {
		new Role({
			user_id: userId,
		})
		.fetch()
		.then(function (group) {
			
		})
	}
}
