var express = require('express'),
	app = express(),
	router = express.Router(),
	path = require('path'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	session = require('express-session'),
	bcrypt = require('bcrypt-nodejs'),
  	LocalStrategy = require('passport-local').Strategy;

//db
var bookshelf = require('./database/schema');

//models
var User = require('./app/models/user'),
	Group = require('./app/models/group'),
	Role = require('./app/models/role');

//collections
var Users = require('./app/collections/users'),
	Groups = require('./app/collections/groups'),
	Roles = require('./app/collections/roles');

//controllers
var UserController = require('./app/controllers/user_controller.js');

//passport error handling
passport.use(new LocalStrategy(function (username, password, done){
	new User({'username': username})
	.fetch()
	.then(function (data){
		if (data === null) {
			return done(null, false, {message: 'Invalid username or password'});
		} else {
			var user = data.toJSON();
			if(!bcrypt.compareSync(password, user.password)) {
				return done (null, false, {message: 'Invalid username or password'});
			} else {
				console.log('correct entries')
				return done(null, user);
			}
		}
	})
}))

//view engine setup
app.set('views', path.join(__dirname, 'app/views'));

//using body-parser
app.use(bodyParser.urlencoded({extended:false}));

//initialize passport session
app.use(session({
	secret: "John's Beer",
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

//serialize user
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

//deserialize user
passport.deserializeUser(function (id, done) {
	console.log(id)
	new User({id: id}).fetch()
	.then(function (user){
		done(null,user.id);
	})
})

//run jade file
app.set('view engine', 'jade');

//--------------------------------------------------------------
//Routes for Users

//index
app.get('/',UserController.index);

app.listen(3000);
console.log('Listening to port 3000');