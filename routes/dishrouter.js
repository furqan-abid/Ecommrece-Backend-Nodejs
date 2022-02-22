const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const dishes=require('../models/dishes')
const authenticate=require('../authenticate')
const cors = require('./cors');

const dishrouter=express.Router();
dishrouter.use(bodyParser.json());

dishrouter.route('/')
.options(cors.corswithoptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    dishes.find(req.query)
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin, (req,res,next)=>{
    dishes.create(req.body)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('put operation is not supported')
})
.delete(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    dishes.remove({})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

dishrouter.route('/:dishid')
.options(cors.corswithoptions,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,(req,res,next)=>{
    dishes.findById(req.params.dishid)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('post operation is not supported')
})
.put(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    dishes.findByIdAndUpdate(req.params.dishid,{
        $set: req.body
    },{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    dishes.findByIdAndRemove(req.params.dishid)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

module.exports = dishrouter;