var request = require('request'),
	Group = require('../../app/models/group'),
	Groups = require('../../app/collections/groups'),
	GroupController = require('../../app/controllers/group_controller.js');

describe('GroupController', function(){

	describe('Tests with data', function(){
		var group;

		beforeEach(function (done) {
			new Group({
				username: 'userTest',
				email: 'test@test.com',
				password: 'password'
			}).save()
			  .then(function (newGroup) {
			  	group = newGroup;
			  	done();
			  });
		});

		afterEach(function (done) {
			new Group({
				id: group.id
			}).destroy()
			  .then(done)
			  .catch(function (error) {
			  	done.fail(error);
			  });
		});

})