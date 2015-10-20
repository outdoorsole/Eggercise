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

//view engine setup
app.set('views', path.join(__dirname, 'app/views'));

//run jade file
app.set('view engine', 'jade');

//using body-parser
app.use(bodyParser.urlencoded({extended:false}));