// //Testing for group model

var Group = require('../../app/models/group');

describe('Group', function() {

	it('should have a group id number', function(){
		var group = new Group();
		group.id = 1;
		expect(group.id).toBe(1);
	});
})
