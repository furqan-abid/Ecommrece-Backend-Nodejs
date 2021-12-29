var passport=require('passport')
var localstrategy=require('passport-local').Strategy;
var User=require('./models/user')
var jwt=require('jsonwebtoken')
var config=require('./config')
var jwtstrategy=require('passport-jwt').Strategy
var ExtractJwt=require('passport-jwt').ExtractJwt;

passport.use(new localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,{expiresIn:3600})
}

var opts={}
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;

exports.jwtpassport=passport.use(new jwtstrategy(opts,
    (jwt_payload,done)=>{
        console.log('jwt payload: ',jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false)
            }
            else if(user){
                return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
    }))

exports.verifyadmin=(req,res,next)=>{
    if(req.user.admin===true){
        return next()
    }
    else{
        var err=new Error('you are not authenticated to perform this operation')
        err.status=403;
        return next(err)
    }
}
exports.verifyuser=passport.authenticate('jwt',{session:false})