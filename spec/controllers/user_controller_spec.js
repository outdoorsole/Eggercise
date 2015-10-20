var request = require('request'),
	User = require('../../app/models/user'),
	Users = require('../../app/collections/users'),
	UserController = require('../../app/controllers/user_controller.js');

describe('UserController', function(){

	describe('Tests with data', function(){
		var user;

		beforeEach(function(done) {
			new User({
				username: 'usercontroller Test',
				password: 'password for controller test'
			}).save()
			  .then(function(newUser) {
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
	})
})