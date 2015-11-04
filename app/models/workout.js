var bookshelf = require('../../database/schema');

var Workout = bookshelf.Model.extend({
	tableName: 'workouts',
	hasTimestamps: true,

	users: function(){
		return this.belongsToMany('User')
		// .through(Role)
	},

	groups: function(){
		return this.belongsToMany('Group');
	}
})

module.exports = bookshelf.model('Workout', Workout)
