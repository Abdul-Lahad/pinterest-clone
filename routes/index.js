var express = require('express');
var router = express.Router();

const userModel = require('./users')
const postModel = require('./post');
const passport = require('passport');
const localStrategy = require("passport-local")
//doing user login
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pintrest' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Pintrest' });
});


router.get('/profile',isLoggedIn, function(req, res, next) {
  res.send('profile');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/registor',function(req,res,next){
  const {username,email,fullname} = req.body
  const userData = new userModel({username,email,fullname})

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })

})

router.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/'
}),function(req,res,next){
  
})

router.get('/logout',function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });

});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();

  res.redirect('/')

}

module.exports = router;
