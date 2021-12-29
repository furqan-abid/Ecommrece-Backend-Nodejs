var express = require('express');
var router = express.Router();
const bodyparser=require('body-parser')
var passport=require('passport');
var User = require('../models/user');
var authenticate= require('../authenticate')
let cors=require('./cors')
router.use(bodyparser.json())
/* GET users listing. */
router.options('*',cors.corswithoptions,(req,res,next)=>{
  res.sendStatus(200);
})
router.get('/',authenticate.verifyuser,authenticate.verifyadmin, function(req, res, next) {
  User.find({})
  .then((user)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json')
    res.json(user)
  },(err)=>next(err))
  .catch(err=>next(err))
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login',cors.corswithoptions, (req, res,next) => {
  passport.authenticate('local',(err,user,info)=>{
    if(err){
      return next(err)
    }
    if(!user){
      res.statusCode=401;
      res.setHeader('Content-Type','application/json')
      res.json({success:false,stauts:'login unsuccessfull',err:info})
    }
    req.logIn(user,(err)=>{
      if(err){
        res.statusCode=401;
        res.setHeader('Content-Type','application/json')
        res.json({success:false,status:'login unsuccessfull',err:info})
      }
      else{
      var token=authenticate.getToken({_id: req.user._id})
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true,token:token, status: 'You are successfully logged in!'});     
    }
    })
  })(req,res,next);
});

router.route('/logout')
.get((req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    let err=new Error('you are not logged in')
    err.status=403;
    next(err)
  }
})
router.get('/checkjwttoken',cors.corswithoptions,(req,res,next)=>{
  passport.authenticate('jwt',{session:false},(err,user,info)=>{
    if(err){
      return next(err)
    }
    if(!user){
      res.statusCode=401;
      res.setHeader('Content-Type','application/json')
      res.json({status:'jwt invalid',success:false,err:info})
    }
    else{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json')
      res.json({status:'jwt valid',success:true,user:user})
    }
  })(req,res,next);
})
module.exports = router;
