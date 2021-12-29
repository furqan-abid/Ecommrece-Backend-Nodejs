const mongoose=require('mongoose');
const Schema=require('mongoose').Schema;
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency
const passportlocalmongoose = require('passport-local-mongoose')

const commentschema=new Schema({
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment:{
        type: String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

const dishSchema=new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:""
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    featured:{
        type:Boolean,
        defalut:false
    },
    comments:[commentschema]
},{
    timestamps:true
});

dishSchema.plugin(passportlocalmongoose)
let dishes=mongoose.model('dishes',dishSchema);
module.exports = dishes;