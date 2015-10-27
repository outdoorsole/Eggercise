var path = require('path'),
    bodyParser = require('body-parser');

//db
var bookshelf = require('../../database/schema');

//models
var Group = require('../models/group'),
	User = require('../models/user');

//collections
var Groups = require('../collections/groups'),
	Users = require('../collections/users');


