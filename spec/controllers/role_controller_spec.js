var request = require('request'),
	Role = require('../../app/models/role'),
	Roles = require('../../app/collections/roles'),
	RoleController = require('../../app/controllers/role_controller.js');

describe('RoleController', function(){

	describe('Tests with data', function(){

		//Test Update
		it('should set non-admin role on user', function (done){
			var testrole = {
				url:"http://localhost:3000/groups/join/"+group.id,
				form:{
					//information the user enters
					user_id: userId,
					group_id: groupId
				},
			};

			request.post(testrole, function (error, response, body) {
				expect(response.statusCode).toBe(302);
				new Role({
					//go to the database and look for this id (including fetch)
					user_id: userId
				})
				.fetch()
				.then(function (newRole) {
					expect(newRole.get('is_admin')).toBe(false);
					done();
				});
			});
		});
	})
})
