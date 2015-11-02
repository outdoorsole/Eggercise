var bookshelf = require('../../database/schema');

var Group = bookshelf.Model.extend({
	tableName: 'groups',
	hasTimestamps: true,

	users: function(){
		return this.belongsToMany('User', 'user_id')
		.through('Role')
	},

	admin: function(){
		return this.hasOne('Role', 'user_id').where('is_admin', true);
	},

	roles: function(){
		return this.hasMany('Role', 'group_id');
	}
})

module.exports = bookshelf.model('Group', Group)
