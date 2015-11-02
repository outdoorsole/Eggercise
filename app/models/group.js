var bookshelf = require('../../database/schema');

var Group = bookshelf.Model.extend({
	tableName: 'groups',
	hasTimestamps: true,

	users: function(){
		return this.belongsToMany('User')
		.through('Role')
	},

	admin: function(){
		return this.hasOne('Role', 'user_id').where('is_admin', true);
	},
})

module.exports = bookshelf.model('Group', Group)
