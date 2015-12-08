// //Testing for user model

var User = require('../../app/models/user');

describe('User', function() {

	it('should have a username', function(){
		var user = new User();
		user.username = "yaejin";
		expect(user.username).toBe("yaejin");
	});

	it('should have a password', function(){
		var user = new User();
		user.password = "password";
		expect(user.password).toBe('password');
	});

	it('should have an email', function(){
		var user = new User();
		user.email = "yaejin91@gmail.com";
		expect(user.email).toBe('yaejin91@gmail.com')
	})

	it('should have a user id number', function(){
		var user = new User();
		user.id = 1;
		expect(user.id).toBe(1);
	});
})
