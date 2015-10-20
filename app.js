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