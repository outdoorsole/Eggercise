var request = require('supertest'),
	session = require('supertest-session'),
	app = require('../../app'),
	Role = require('../../app/models/role'),
	User = require('../../app/models/user'),
	Group = require('../../app/models/group'),
	Roles = require('../../app/collections/roles'),
	Users = require('../../app/collections/users'),
	Groups = require('../../app/collections/groups'),
	RoleController = require('../../app/controllers/role_controller.js'),
	UserController = require('../../app/controllers/user_controller.js'),
	GroupController = require('../../app/controllers/group_controller.js');

describe('RoleController', function(){
	describe('Tests with data', function(){
		var user;
		var testSession = null;

		beforeEach(function (done) {
			testSession = session(app);
			new User({
				username: 'roleTest',
				email: 'role@test.com',
				password: 'password'
			})
			.save()
			.then(function (newUser) {
				user = newUser;
				new Group({
					name: 'roleTest',
					price: 200
				})
				.save()
				.then(function (newGroup) {
					group = newGroup;
				done();
				})
			})
		})
	})
})
