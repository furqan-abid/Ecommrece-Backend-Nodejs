const express=require('express');
const bodyParser=require('body-parser');
const leaderrouter=express.Router();
leaderrouter.use(bodyParser.json());
const leaders=require('../models/leaders');
let authenticate=require('../authenticate')

leaderrouter.route('/')
.get((req,res,next)=>{
    leaders.find(req.query)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader)
    },err=>next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    leaders.create(req.body)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader);
    },err=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('put operation is not supported')
})
.delete(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    leaders.delete({})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },err=>next(err))
    .catch((err)=>next(err))    
})

leaderrouter.route('/:leaderid')
.get((req,res,next)=>{
    leaders.findById(req.params.leaderid)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },err=>next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('post operation is not supported')
})
.put(authenticate.verifyuser,(req,res,next)=>{
    leaders.findByIdAndUpdate(req.params.leaderid,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },err=>next(err))
    .catch((err)=>next(err))
})
.delete(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    leaders.findByIdAndDelete(req.params.leaderid)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },err=>next(err))
    .catch((err)=>next(err))
})

module.exports=leaderrouter;