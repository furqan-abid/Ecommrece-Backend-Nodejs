const express=require('express');
const bodyParser=require('body-parser');
const promos=require('../models/promo')
const authenticate=require('../authenticate')
const promorouter=express.Router();
promorouter.use(bodyParser.json());

promorouter.route('/')
.get((req,res,next)=>{
    promos.find(req.query)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applicaiton/json')
        res.json(promo)
    },err=>next(err))
    .catch(err=>next(err))
})
.post(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    promos.create(req.params.body)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err=>next(err))
    .catch(err=>next(err))
})
.put(authenticate.verifyuser,(req,res,next)=>{
    res.statusCode=403;
    res.end('put operation is not supported')
})
.delete(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    promos.remove({})
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err=>next(err))
    .catch((err)=>next(err))
})

promorouter.route('/:promoid')
.get((req,res,next)=>{
    promos.findById(req.params.promoid)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err=>next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyuser,(req,res,next)=>{
    res.statusCode=403;
    res.end('post operation is not supported')
})
.put(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    promos.findByIdAndUpdate(req.params.promoid,{
        $set:req.body
    },{new:true})
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err=>next(err))
    .catch((err)=>next(err))
})
.delete(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    promos.findByIdAndDelete(req.params.promoid)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err=>next(err))
    .catch((err)=>next(err))
})

module.exports=promorouter;