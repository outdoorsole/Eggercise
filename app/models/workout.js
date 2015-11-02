var bookshelf = require('../../database/schema');

var Workout = bookshelf.Model.extend({
	tableName: 'workouts',
	hasTimestamps: true,

	users: function(){
		return this.belongsToMany('User', 'user_id')
		.through(Role)
		.withPivot(['user_type'])
	},

	groups: function(){
		return this.belongsToMany('Group', 'group_id');
	}
})

module.exports = bookshelf.model('Workout', Workout)
