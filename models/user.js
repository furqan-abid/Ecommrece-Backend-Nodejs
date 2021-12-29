let mongoose=require('mongoose');
let schema=require('mongoose').Schema;
let passportlocalmongoose=require('passport-local-mongoose')

let user=new schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,
        default:false
    }
})
user.plugin(passportlocalmongoose);

module.exports=mongoose.model('user',user)