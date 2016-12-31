/*
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js');
function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', 'Please login first!');
		res.redirect('/login');
	}
	next();
};
module.exports = function(app) {
	app.get('/',function (req,res) {
		Post.get(null, function(err, posts) {
			if (err) {
				posts = [];
			}
		res.render('index',{
			title:'Home Page',
			user: req.session.user,
			posts: posts,
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
		res.render('login',{
			title: 'Login',
			user: req.session.user,
			success: req.flash('success').toString(),
			error:req.flash('error').toString()});
	});
	app.post('/login', function(req, res) {
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(req.body.name, function(err,user) {
			if (!user) {
				req.flash('error','User doesn\'t exist!');
				return res.redirect('/login');
			}
			if (user.password != password) {
				req.flash('error', 'wrong password!');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success', 'Login successful!');
			res.redirect('/');
		});
	});
	app.get('/post',function(req, res) {
		res.render('post',{
			title: 'Post',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
			});
	});
	app.post('/post', checkLogin);
	app.post('/post',function(req, res) {
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save(function (err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', 'Post successful!');
			res.redirect('/');
			});
	});
	app.get('/logout',function(req, res) {
		req.session.user = null;
		req.flash('success', 'logout suceessful!');
		res.redirect('/');
	});
});
};
