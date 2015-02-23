var auction = require("../own_modules/auctionLib.js").init("data/auction.db");


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

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/adminLogin',function(req,res){
	res.render('adminLogin');
});

router.post('/adminLogin',function(req,res){
	res.render('adminDashboard');
});


module.exports = router;
