//Database
//Set environment variables for local session in .bash_profile:
//Example:
//export DATABASE_HOST='localhost'
//export DATABASE_USER='username'
//export DATABASE_PASS='password'

var knex = require('knex')({
	client:'pg',
	connection: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATBASE_USER,
		password: process.env.DATABASE_PASS,
		database: 'eggercise'
	}
});

var bookshelf = require('bookshelf')(knex);

//Dependency
bookshelf.plugin('registry');

//Users Column
bookshelf.knex.schema.hasTable('users')
.then(function (exists){
	if(!exists){
		bookshelf.knex.schema.createTable('users', function (user){
			user.increments('id').primary();
			user.string('username', 50).unique().notNullable();
			user.string('email', 100).unique().notNullable();
			user.string('password', 264).notNullable();
			user.timestamps();
		})
		.then(function (table){
			console.log('Table for users is created', table)
		});
	}
});

//Groups Column
bookshelf.knex.schema.hasTable('groups')
.then(function (exists){
	if(!exists){
		bookshelf.knex.schema.createTable('groups', function (group){
			group.increments('id').primary();
			group.string('name', 200).notNullable();
			group.integer('price').unsigned();
			group.timestamps();
		})
		.then(function (table){
			console.log('Table for groups is created', table)
		});
	}
});

//Users and Groups Join (Role) Column
bookshelf.knex.schema.hasTable('roles')
.then(function (exists){
	if(!exists){
		bookshelf.knex.schema.createTable('roles', function (role){
			role.increments('id').primary();
			role.boolean('is_admin').defaultTo(false);
			role.boolean('is_member').defaultTo(false);

			//Foreign key to users
			role.integer('user_id').unsigned()
			.references('users.id');

			//Foreign key to groups
			role.integer('group_id').unsigned()
			.references('groups.id');
		})
		.then(function (table){
			console.log('Table for roles is created', table)
		});
	}
});

bookshelf.knex.schema.hasTable('workouts')
.then(function (exists){
	if(!exists){
		bookshelf.knex.schema.createTable('workouts', function (workout){
			workout.increments('id').primary();
			workout.timestamps();

			//Foreign key to users
			workout.integer('user_id').unsigned()
			.references('users.id');

			//Foreign key to groups
			workout.integer('group_id').unsigned()
			.references('groups.id');
		})
		.then(function (table){
			console.log('Table for workouts is created', table)
		});
	}
});

module.exports = bookshelf;
