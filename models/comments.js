const mongoose=require('mongoose')
const Schema=require('mongoose').Schema;

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
    },
    dish:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dishes'
    }
},{
    timestamps:true
})

let comments=mongoose.model('comments',commentschema)
module.exports=comments;