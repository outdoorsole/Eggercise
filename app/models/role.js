var bookshelf = require('../../database/schema');

var Role = bookshelf.Model.extend({
	tableName: 'roles',

	users: function() {
		return this.belongsToMany('Group', 'group_id')
	},

	groups: function() {
		return this.belongsToMany('User', 'user_id')
	}
})

module.exports = bookshelf.model('Role', Role)