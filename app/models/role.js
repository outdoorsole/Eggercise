var bookshelf = require('../../database/schema');

var Role = bookshelf.Model.extend({
	tableName: 'roles',

	users: function() {
		return this.belongsToMany('User', 'users', 'id')
	},

	groups: function() {
		return this.belongsToMany('Group')
	}
})

module.exports = bookshelf.model('Role', Role)