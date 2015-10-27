var bookshelf = require('../../database/schema');

var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,

	groups: function(){
		return this.belongsToMany('Group', 'group_id')
		.through(Role)
		.withPivot(['user_type'])
	},

	roles: function(){
		return this.belongsToMany('Role', 'user_id')
	}
})

module.exports = bookshelf.model('User', User);
