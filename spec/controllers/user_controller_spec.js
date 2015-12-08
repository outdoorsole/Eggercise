var request = require('supertest'),
	express = require('express'),
	bcrypt = require('bcrypt-nodejs'),
	app = express(),
	agent = request.agent(app);

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

		// Test Create
		it('should create a new user', function (done){
			var testUser = {
				url:"http://localhost:3000/signup",
				form:{
					username:'createTestUser',
					password: hash,
					email:'createTest1@email.com'
				}
			};
		request
		.post(testUser, function (error, response, body){
			new User({
				username: 'createTestUser',
			})
			.fetch()
			.then(function (newUser){
				console.log('This is newUser: ', newUser)
				expect(newGroup.get('username')).toBe('createTestUser');
				new Group({
					id: newUser.id
				})
				.destroy()
				.then(function (){
					done();
				})
			});
		});

		//Test Create User
		// it('should create a new User', function (done) {
		// 	agent
		// 	.post('/signup')
		// 	.send({
		// 		username: 'createUserTest',
		// 		password: hash,
		// 		email:'create@test.com'
		// 	})
		// 	.expect('Content-Type', /html/)
		// 	.end(function (error, res) {
		// 		console.log('reached .end');
		// 		if (error) {
		// 			done.fail(error);
		// 		} else {
		// 			console.log(res);
		// 			done();
		// 		}

		// 		//else {
		// 		// 	// console.log(res);
		// 		// 	var returnedUser = res._data;
		// 		// 	new User({username: 'createUserTest'})
		// 		// 	.fetch()
		// 		// 	.then(function (user) {
		// 		// 		console.log(user);
		// 		// 		expect(user.username).toBe('createUserTest');
		// 		// 		user.destroy();
		// 		// 		done();
		// 		// done();
			
			// });
		});
	});
});
