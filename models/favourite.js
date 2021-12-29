const mongoose = require('mongoose')
const Schema = require('mongoose').Schema;

const favouriteschema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dishes'
    }],
    
},{
    timestamps:true
})
let favourite=mongoose.model('favourite',favouriteschema);
module.exports=favourite;