var auction = require("../own_modules/auctionLib.js").init("./data/auction.db");
var _ = require('lodash');

var express = require('express');
var router = express.Router();


var loadUserFromSession = function(req,res,next){
	req.session.userEmail && lib.getSingleUser(req.session.userEmail, function(err, user){
		if(user){
			var userInfo = {
				id: user.id,
				name: user.name,
				email_id: user.email_id
			};
			req.user = userInfo;
			res.locals.user = userInfo;
		}else{
			delete req.session.userEmail;
		}
	});
	next();		
};

var requireLogin = function(req,res,next){
	req.session.userEmail? next(): res.redirect('/login');
};

router.use(loadUserFromSession);

/* GET home page. */
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

router.post('/adminLogin',function(req,res){
	if(req.body.email_id=='pk@gmail.com' && req.body.password==1234)
		res.render('adminDashboard');
	res.render('adminLogin');
});

router.get('/itemDescription/:id', function(req, res) {
	auction.getItemsAllDetail(req.params.id,function(err, allDetail){
  		res.render('itemDescription', {
  		  allDetail: allDetail
  		}); 
  	});
});

router.get('/addItems',function(req,res){
	res.render('addItems');
});


module.exports = router;
