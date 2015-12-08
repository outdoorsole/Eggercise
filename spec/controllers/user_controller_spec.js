var request = require('supertest'),
	express = require('express'),
	bcrypt = require('bcrypt-nodejs'),
	agent = request.agent();

var UserController = require('../../app/controllers/user_controller');

//model
var User = require('../../app/models/user'),
	Group = require('../../app/models/group');

describe('UserController', function () {
	var user;

	beforeAll(function (done) {
		var password = 'testpw',
			salt = bcrypt.genSaltSync(10),
			hash = bcrypt.hashSync(password,salt);

		new User({
			username: 'testUser1',
			password: hash,
			email: 'testemail1@test.com'
		})
		.save()
		.then(function (userData) {
			user = userData;
			agent
			.post('/signin')
			.send({ username: user.username, password: user.password})
			.end(function (error, res) {
				if (error) {
					done.fail(error);
				} else {
					console.log('This is user.id',user.id);
					done();
				}
			});
		});
	});

	afterAll(function (done) {
		new User({
			username: 'testUser1'
		})
		.fetch()
		.then(function (user) {
			user.destroy()
			.then(function () {
				done();
			})
			.catch(function (error){
				console.error(error.stack);
			});
		});
	});

	describe('Test with data', function () {
		var password = 'createTest',
		salt = bcrypt.genSaltSync(10),
		hash = bcrypt.hashSync(password,salt);
	});
});
