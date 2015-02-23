var auction = require("../own_modules/auctionLib.js").init("data/auction.db");
var bcrypt = require("bcryptjs");
var _ = require('lodash');

var express = require('express');
var router = express.Router();



var loadUserFromSession = function(req,res,next){
	req.session.user_name && auction.getSingleUser(req.session.user_name, function(err, user){
		if(user){
			var userInfo = {
				// id: user.id,
				// name: user.name,
				user_name: user.user_name
			};
			req.user = userInfo;
			res.locals.user = userInfo;
		}else{
			delete req.session.user_name;
		}
	});
	next();		
};

var requireLogin = function(req,res,next){
	req.session.user_name? next(): res.redirect('/adminLogin');
};

router.use(loadUserFromSession);

/* GET home page. */
router.get('/', function(req, res) {
  // res.render('index', { title: 'Auction' });
	auction.getTopicsNameAndDate(function(err, topics){
  		res.render('index', {
  		  topics: topics
  		}); 
  	});
});

router.get('/adminLogin',function(req,res){
	res.render('adminLogin');
});

router.get('/adminDashboard',requireLogin,function(req,res){
	res.render('adminDashboard');
});

router.get('/adminLogout',function(req,res){
	req.session.destroy();
	res.redirect('/adminLogin');
});

router.post('/adminLogin',function(req,res){
	var userInfo = req.body;
	var callback = function(error,data){
		if(((data===undefined) || error || (userInfo.password!=data.password))){
		 		res.render('adminLogin', {error:"Invalid Username or Password.."});
		};
		if(!error && (data!==undefined) && (userInfo.password==data.password)){
			req.session.user_name = data.user_name;
  			res.redirect('adminDashboard');
		};
	};

	auction.getPassword(userInfo.user_name,callback);
});

router.get('/addItems',function(req,res){
	res.render("addItems");
});

router.post("/addItems",function(req,res){
	var newItem  = req.body;
	auction.insertItem(newItem,function(err){
		if(!err){
			res.redirect("/adminDashboard");
		}
	});
});


module.exports = router;
