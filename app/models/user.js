var bookshelf = require('../../database/schema');

var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,

	groups: function(){
		return this.belongsToMany('Group', 'group_id')
		.through(Role)
		.withPivot(['user_type'])
	}
})

module.exports = bookshelf.model('User', User);