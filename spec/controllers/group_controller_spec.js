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


		// Test Show
		it('should return groups', function (done) {
			request('http://localhost:3000/groups', function (error,response,body) {
				expect(response.statusCode).toBe(200);
				done();
			})
		});

		// Test Create
		it('should create a new group', function (done){
			var testgroup = {
				url:"http://localhost:3000/groups",
				form:{
					name:'testGroup',
					price:9000
				}
			};

			request.post(testgroup, function (error, response, body){
				console.log('This is testgroup: ', testgroup);
				new Group({
					name: 'testGroup',
				}).fetch()
				  .then(function (newGroup){
			  		expect(newGroup.get('name')).toBe('testGroup');
			  		new Group({
			  			id: newGroup.id
			  		}).destroy()
			  		  .then(function (model){
				  		done();
			  		  })
				  });
			});
		});

		//Test Update
			it('should update current group name and/or buy-in price', function (done){
				var testgroup = {
					url:"http://localhost:3000/groups/edit/"+group.id,
					form:{
						//information the user enters
						name: 'testGroupUpdate',
						price: 5000
					},
				};

				console.log('This is testgroup: '+testgroup);
				console.log('This is testgroup.id: '+testgroup.id);
				console.log('This is testgroup.name: '+testgroup.form.name);
				console.log('This is group: '+group);
				console.log('This is group.id: '+group.id);
				console.log('This is group.price: '+group.form.price);

				request.post(testgroup, function (error, response, body) {
					expect(response.statusCode).toBe(302);
					new Group({
						//go to the database and look for this id (including fetch)
						id: group.id
					}).fetch()
					  .then(function (newGroup) {
				  		expect(newGroup.get('price')).toBe(5000);
						console.log('I fetched');
						console.log('This is group price: '+testgroup.price);
				  		done();
					  });
				});
			});
	});
});
