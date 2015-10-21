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

		//Test Create
		it('should create a new user', function (done){
			var testuser = {
				url:"http://localhost:3000/users/create",
				form:{
					username:'testCreate',
					email: 'test@test.com',
					password:'password'
				}
			};

			request.post(testuser, function (error, response, body){
				new User({
					username:'testCreate',
					email: 'test@test.com',
					password:'password'
				}).fetch()
				  .then(function (newUser){
				  		console.log("newUser is: "+newUser);
				  		expect(newUser.id).toBeGreaterThan(user.id);
				  		new User({
				  			id: newUser.id
				  		}).destroy()
				  		done();
				  });
			});
		});
	});
})