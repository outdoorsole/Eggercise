var bookshelf = require('../../database/schema');

var Group = bookshelf.Model.extend({
	tableName: 'groups',
	hasTimestamps: true,

	users: function(){
		return this.belongsToMany('User', 'user_id')
		.through(Role)
		.withPivot(['user_type'])
	}
})

module.exports = bookshelf.model('Group', Group)