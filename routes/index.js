/*
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
var crypto = require('crypto'),
	User = require('../models/user.js');

module.exports = function(app) {
	app.get('/',function (req,res) {
		res.render('index',{
			title:'Home Page',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
			});
	});
	app.get('/reg',function (req, res) {
		res.render('reg',{
			title:'Register',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
			});
	});
	app.post('/reg',function(req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		if (password_re != password) {
			req.flash('error', 'Password does not match!');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		User.get(newUser.name, function(err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			if (user) {
				req.flash('error', 'User name already exits!');
				return res.redirect('/reg');
			}
			newUser.save(function (err, user) {
				if (err) {
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success', 'Successfully registered!');
				res.redirect('/');
			});
		});
	});
	app.get('/login',function(req, res) {
		res.render('login',{title: 'Login'});
	});
	app.post('/login', function(req, res) {
	});
	app.get('/post',function(req, res) {
		res.render('post',{title: 'Post' });
	});
	app.post('/post',function(req, res) {
	});
	app.get('/logout',function(req, res) {
	});
};
