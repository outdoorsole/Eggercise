var request = require('request'),
	Group = require('../../app/models/group'),
	Groups = require('../../app/collections/groups'),
	GroupController = require('../../app/controllers/group_controller.js');

describe('GroupController', function(){

	describe('Tests with data', function(){
		var group;

		beforeEach(function (done) {
			new Group({
				name: 'groupTest',
				price: 150
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

		//Test Show
		it('should return groups', function (done) {
			request('http://localhost:3000/groups', function (error,response,body) {
				expect(response.statusCode).toBe(200);
				done();
			})
		});

		// Test Create
		// it('should create a new group', function (done){
		// 	var testgroup = {
		// 		url:"http://localhost:3000/groups",
		// 		form:{
		// 			name:'testGroup',
		// 			price:9000
		// 		}
		// 	};

		// 	request.post(testgroup, function (error, response, body){
		// 		new Group({
		// 			name: 'testGroup',
		// 		}).fetch()
		// 		  .then(function (newGroup){
		// 	  		expect(newGroup.get('name')).toBe('testGroup');
		// 	  		new Group({
		// 	  			id: newGroup.id
		// 	  		}).destroy()
		// 	  		  .then(function (model){
		// 		  		done();
		// 	  		  })
		// 		  });
		// 	});
		// });

		//Test Update (DOES NOT WORK WITH AUTHENTICATION)
			it('should update current group name and/or buy-in price', function (done){
				var testgroup = {
					url:"http://localhost:3000/users/edit/"+group.id,
					form:{
						//information the user enters
						name: 'testGroupUpdate',
						price: 420
					},
				};

				request.post(testgroup, function (error, response, body) {
					expect(response.statusCode).toBe(302);
					new Group({
						//go to the database and look for this id (including fetch)
						id: group.id
					}).fetch()
					  .then(function (newGroup) {
				  		expect(newGroup.get('price')).toBe(420);
				  		done();
					  });
				});
			});
	})

})