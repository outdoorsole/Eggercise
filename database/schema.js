//Database
var knex = require('knex')({
	client:'pg',
	connection: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATBASE_USER,
		password: process.env.DATABASE_PASS,
		database: 'eggercise'
		//type in export DATABASE_HOST(or USER, PASS) in terminal
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
			role.string('user_type', 50);
			role.boolean('is_admin').defaultTo(false);

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

module.exports = bookshelf;
