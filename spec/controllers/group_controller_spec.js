var session = require('supertest-session'),
	exercisebet = require('../../app'),
	bcrypt = require('bcrypt-nodejs'),
	Group = require('../../app/models/group'),
	User = require('../../app/models/user'),
	Groups = require('../../app/collections/groups'),
	GroupController = require('../../app/controllers/group_controller.js');

var testSession = null;

describe('GroupController', function(){

	beforeEach(function(done) {

	});
	
	describe('Tests with data', function(){
		// var group;
		// var user;
		
		// beforeEach(function (done) {
		// 	var password = 'testpw',
		// 		salt = bcrypt.genSaltSync(10),
		// 		hash = bcrypt.hashSync(password,salt);

		// 	new User({
		// 		username: 'testid1',
		// 		email: 'test2@test.com',
		// 		password: hash
		// 	}).save()
		// 	  .then(function (userData) {
		// 	  	user = userData;
		// 	  	new Group({
		// 		name: 'groupTest',
		// 		price: 150
		// 		}).save()
		// 	  	  .then(function (newGroup) {
		// 	  		group = newGroup;
		// 	  		done()
		//    		  })
			  
		// 	});

		// });

		// afterEach(function (done) {
		// 	new Group({
		// 		id: group.id
		// 	}).destroy()
		// 	  .then(done)
		// 	  .catch(function (error) {
		// 	  	done.fail(error);
		// 	  });
		// });

		// Test Show
		// it('should return groups', function (done) {
		// 	request('http://localhost:3000/groups', function (error,response,body) {
		// 		expect(response.statusCode).toBe(200);
		// 		done();
		// 	})
		// });

		// Test Create
		// it('should create a new group', function (done){
		// 	var testgroup = {
		// 		url:"http://localhost:3000/groups/create",
		// 		form:{
		// 			name:'testGroup',
		// 			price:9000
		// 		}
		// 	};


		// 	request.post(testgroup, function (error, response, body){
  //              new Group({
  //                      name: 'testGroup',
  //              }).fetch()
  //                .then(function (newGroup){
  //                      console.log('This is newGroup: '+newGroup)
  //                      expect(newGroup.get('name')).toBe('testGroup');
  //                      expect(newGroup.admin().get('user_id')).toBe(user.get('id'));
  //                      new Group({
  //                              id: newGroup.id
  //                      }).destroy()
  //                        .then(function (model){
  //                              done();
  //                        })
  //                });			
		// });

		//Test Update
		// it('should update current group name and/or buy-in price', function (done){
		// 	var testgroup = {
		// 		url:"http://localhost:3000/groups/edit/"+group.id,
		// 		form:{
		// 			//information the user enters
		// 			name: 'testGroupUpdated',
		// 			price: 5000
		// 		},
		// 	};

		// 	request.post(testgroup, function (error, response, body) {
		// 		expect(response.statusCode).toBe(302);
		// 		new Group({
		// 			//go to the database and look for this id (including fetch)
		// 			id: group.id
		// 		}).fetch()
		// 		  .then(function (newGroup) {
		// 	  		expect(newGroup.get('price')).toBe(5000);
		// 	  		done();
		// 		  });
		// 	});
		// });


		//Test Delete
		// it('should delete a selected group', function (done){
		// 	var testgroup = {
		// 		url:"http://localhost:3000/groups/delete/"+group.id
		// 	};

		// 	request.get(testgroup, function (error, response, body) {
		// 		new Group({
		// 			id: group.id
		// 		}).fetch()
		// 		  .then(function (newGroup) {
		// 	  		expect(newGroup).toBeNull();
		// 	  		done();
		// 		  })
		// 	})
		// })
	})

})

