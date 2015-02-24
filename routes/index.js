var auction = require("../own_modules/auctionLib.js").init("data/auction.db");
var bcrypt = require("bcryptjs");
var _ = require('lodash');

var express = require('express');
var router = express.Router();



var loadUserFromSession = function(req,res,next){
	req.session.user_name && auction.getSingleUser(req.session.user_name, function(err, user){
		if(user){
			var userInfo = {
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

var requireLoginForUser = function(req,res,next){
	req.session.userEmail? next(): res.redirect('/userLogin');
};

router.use(loadUserFromSession);

router.get('/', function(req, res) {
	auction.getTopicsNameAndDate(function(err, topics){
  		res.render('index', {
  		  topics: topics
  		}); 
  	});
});

router.get('/adminLogin',function(req,res){
	res.render('adminLogin');
});

router.get('/userLogin',function(req,res){
	res.render('userLogin');
});

router.get('/userLogout',function(req,res){
	req.session.destroy();
	res.redirect('/userLogin');
});

router.post('/userLogin',function(req,res){
	var userInfo = req.body;
	var callback = function(error,data){
		if(((data===undefined) || error || 
			(!bcrypt.compareSync(userInfo.password,data.password)))){
		 	res.render('userLogin', {error:"Invalid Username or Password.."});
		};
		if(!error && (data!==undefined) && 
			bcrypt.compareSync(userInfo.password,data.password)){
			req.session.userEmail = userInfo.email_id;
			req.session.user_id = data.id;
			req.session.name = data.name;
  			res.redirect('/userDashboard');
		};
	};

	auction.getUserPassword(userInfo.email_id,callback);
});

router.get('/userRegistration',function(req,res){
	res.render('userRegistration');
});

router.get('/userDashboard',requireLoginForUser,function(req,res){
	res.render('userDashboard');
});

router.post('/userRegistration',function(req,res){
	var userInfo = req.body;
	userInfo.password = bcrypt.hashSync(userInfo.password);
	var callback = function(error){
		error && res.render('/', {error:"User already present.."});
		!error && res.redirect('/userLogin');
	};
	auction.insertUsers(userInfo,callback);
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

router.get('/itemDescription/:id', function(req, res) {
	auction.getItemsAllDetail(req.params.id,function(err, allDetail){
  		res.render('itemDescription', {
  		  allDetail: allDetail
  		}); 
  	});
});

router.get('/addItems',function(req,res){
	res.render("addItems");
});

router.post("/addItems",function(req,res){
	var newItem  = req.body;
	newItem.start_Time = new Date().toString().split('GMT')[0];
	auction.insertItem(newItem,function(err){
		if(!err){
			res.redirect("/adminDashboard");
		}
	});
});

























router.get('/viewUpcomingAuction',requireLogin,function(req,res){
	auction.getUpcomingAuction(function(err,upcomingAuction){
		res.render('viewUpcomingAuction',{
			upcomingAuction : upcomingAuction
		});
	})
});


































module.exports = router;
