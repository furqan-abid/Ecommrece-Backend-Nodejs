const express= require('express');
const bodyparser= require('body-parser');
const mongoose=require('mongoose');
const favourite=require('../models/favourite');
const authenticate=require('../authenticate')
const cors=require('./cors')

const favouriterouter=express.Router();
favouriterouter.use(bodyparser.json());

favouriterouter.route('/')
.options(cors.corswithoptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    favourite.find({"user":req.user._id})
    .populate('user')
    .populate('dishes')
    .then((fav)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(fav)
    })   
    .catch((err)=>next(err))       
})
.post(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    favourite.findOne({"user":req.user._id})
    .then((fav)=>{
        console.log('this is first fav',fav)
        if(!fav){
            favourite.create(req.body)
            .then((fav)=>{
                fav.user=req.user._id;
                fav.dishes.push(req.body._id)
                fav.save()
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(fav)
                },err=>next(err))
                .catch((err)=>next(err))
            },err=>next(err))
            .catch((err)=>next(err))
        }
        else{
            if(fav.dishes.indexOf(req.body._id)>-1){
                var err=new Error('this is already in your favourite list')
                err.status=404;
                return next(err)
            }
            else{
                fav.user=req.user._id
                fav.dishes.push(req.body._id)
                fav.save()
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(fav)
                },err=>next(err))
                .catch((err)=>next(err))
            }
        }
    },err=>next(err))
    .catch((err)=>next(err))
})
.delete(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    favourite.remove({"user":req.user._id})
    .then((fav)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(fav)
    })
})

favouriterouter.route('/:dishid')
.get(cors.cors.authenticate.verifyuser,(req,res,next)=>{
    favourite.find({"user":req.user._id})
    .then((fav)=>{
        if(!fav){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json({"exists":false,"favourite":favourite})
        }
        else if(fav.dishes.indexOf(req.params.dishid)>-1){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json({"exists":true,"favourite":favourite})
        }
        else{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json({"exists":false,"favourite":favourite})
        }
    })
})
.post(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    favourite.findOne({"user":req.user._id})
    .then((fav)=>{
        if(fav){
            if(fav.dishes.indexOf(req.params.dishid)>-1)
            {
                let err=new Error('dish already exist')
                err.status=404;
                return next(err);
            }
            else{
            fav.user=req.user._id;
            fav.dishes.push(req.params.dishid)
            fav.save()
            .then((fav)=>{
                favourite.findById(fav._id)
                .populate('user')
                .populate('dishes')
                .then((fav)=>{
                    res.statusCode=200
                    res.setHeader('Content-Type','application/json')
                    res.json(fav)
                },err=>next(err))
            },err=>next(err))
        }
        }
        else{
            console.log(fav)
            let err=new Error('no favourite document exists')
            err.status=404;
            return next(err)
        }
    },err=>next(err))
})
.delete(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    favourite.findOne({"user":req.user._id})
    .then((fav)=>{
        console.log(fav)
        let index=fav.dishes.indexOf(req.params.dishid)
        if(index>-1){
            fav.dishes.splice(index,1)
            fav.save()
            .then((fav)=>{
                favourite.findById(fav._id)
                .populate('user')
                .populate('dishes')
                .then((fav)=>{
                    res.statusCode=200
                    res.setHeader('Content-Type','application/json')
                    res.json(fav)
                },err=>next(err))
            },err=>next(err))
        }
        else{
            let err=new Error('dish does not exits in favourites')
            err.status=404;
            return next(err)
        }
    },err=>next(err))
})

module.exports=favouriterouter;