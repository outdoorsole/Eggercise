var bookshelf = require('../../database/schema');

var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,

	groups: function(){
		return this.belongsToMany('Group')
		.through('Role')
		.withPivot(['is_member', 'is_admin'])
	},
})

module.exports = bookshelf.model('User', User);
