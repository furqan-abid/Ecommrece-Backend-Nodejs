const mongoose=require('mongoose');
const schema=require('mongoose').Schema;

const leadersschema=new schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    }
})

const leaders=mongoose.model('leader',leadersschema);
module.exports=leaders;