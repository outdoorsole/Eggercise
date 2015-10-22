var request = require('request'),
	User = require('../../app/models/user'),
	Users = require('../../app/collections/users'),
	UserController = require('../../app/controllers/user_controller.js');

describe('UserController', function(){

	describe('Tests with data', function(){
		var user;

		beforeEach(function (done) {
			new User({
				username: 'userTest',
				email: 'test@test.com',
				password: 'password'
			}).save()
			  .then(function (newUser) {
			  	user = newUser;
			  	done();
			  });
		});

		afterEach(function(done) {
			new User({
				id: user.id
			}).destroy()
			  .then(done)
			  .catch(function (error) {
			  	done.fail(error);
			  });
		});

		//Test Show
		// it('should return users', function (done) {
		// 	request('http://localhost:3000/', function (error,response,body) {
		// 		expect(response.statusCode).toBe(200);
		// 		done();
		// 	})
		// });

		// Test Create
		// it('should create a new user', function (done){
		// 	var testuser = {
		// 		url:"http://localhost:3000/signup",
		// 		form:{
		// 			username:'testCreate',
		// 			email: 'test@test.com',
		// 			password:'password'
		// 		}
		// 	};

		// 	request.post(testuser, function (error, response, body){
		// 		new User({
		// 			email: 'test@test.com',
		// 		}).fetch()
		// 		  .then(function (newUser){
		// 		  		expect(newUser.get('username')).toBe('testCreate');
		// 		  		new User({
		// 		  			id: newUser.id
		// 		  		}).destroy()
		// 		  		  .then(function (model){
		// 			  		done();
		// 		  		  })
		// 		  });
		// 	});
		// });

		//Test Update
		it('should update a current user password', function (done){
			var testuser = {
				url:"http://localhost:3000/users/edit/"+user.id,
				form:{
					username:'testCreate',
					email: 'test@test.com',
					password:'password'
				},

			};

			request.post(testuser, function (error, response, body) {
				console.log('This is the error: ', error);
				console.log('This is the response: ', response);
				console.log('This is the body: ', body);
				expect(response.statusCode).toBe(302);
				new User({
					id: user.id
				}).fetch()
				  .then(function (newUser) {
				  		expect(newUser.get('password')).toBe('password');
				  		new User({
				  			id: user.id
				  		}).destroy()
				  		  .then(function (model){
					  		done();
				  		  })
				  });
			});

		});
	});
})
