const mongoose=require('mongoose');
const schema=require('mongoose').Schema;
require('mongoose-currency').loadType(mongoose);
const currency=mongoose.Types.Currency

const promoschema=new schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:""
    },
    price:{
        type:currency,
        required:true,
        min:0
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

const promos=mongoose.model('promo',promoschema)
module.exports = promos;