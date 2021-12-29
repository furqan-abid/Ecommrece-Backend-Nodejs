const express= require('express')
const comments=require('../models/comments')
const bodyparser=require('body-parser')
const authenticate=require('../authenticate')
const cors=require('./cors')
const { verify } = require('jsonwebtoken')

const commentsRouter=express.Router();
commentsRouter.use(bodyparser.json())

commentsRouter.route('/')
.options(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    comments.find(req.query)
    .populate('author')
    .then((comments)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(comments)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    if(req.body){
        req.body.auther=req.user._id
        comments.create(req.body)
        .then((comments)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(comments)
        },(err)=>next(err))
        .catch((err)=>next(err))
    }
    else{
        let error=new Error('comments not found in req body')
        err.status=404;
        return next(err)
    }
})
.put(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    res.statusCode=403;
    res.end('put operation is not supported on '+req.params.dishid)
})
.delete(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    comments.remove({})
    .then((comments)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(comments)
    },err=>next(err))
})

    dishrouter.route('/:commentid')
    .options(cors.cors,(req,res)=>{
        res.sendStatus(200)
    })
    .get(cors.cors,(req,res,next)=>{
        comments.findById(req.params.commentid)
        .populate('author')
        .then((comment)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(comment)
        },err=>next(err))
    })
    .post(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
        res.statusCode=403;
        res.end('post operation is not supported')
    })
    .put(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
        comments.findById(req.params.commentid)
        .then((comment)=>{
            if(comment){
                if(!comment.author.equals(req.user._id)){
                    let err=new Error('you are not authorized to perform this operation')
                    err.status=404;
                    return next(err)
                }
                req.body.author=req.user._id;
                comments.findByIdAndUpdate(req.params.commentid,{
                    $set:req.body
                },{new:true})
                .then((comment)=>{
                    comments.findById(comment.id)
                    .populate('author')
                    .then((comment)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json')
                        res.json(comment)
                    })
                })
            }
            else{
                let err=new Error('comment '+req.params.commentid+'not found')
                err.status=404;
                return next(err)
            }
        })
    })
    .delete(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
       comments.findById(req.params.commentid)
       .tehn((comment)=>{
           if(comment!=null){
               if(!comment.author.equals(req.user._id)){
                   var err=new Error('your are not authenticated to perform this operation')
                   err.statusCode=404;
                   return next(err)
               }
               comments.findByIdAndDelete(req.params.commentid)
               .then((resp)=>{
                   res.statusCode=200;
                   res.setHeader('Content-Type','application/json')
                   res.json(resp)
               })
           }  
           else{
            var err=new Error('comment does not exists')
            err.statusCode=404;
            return next(err)
        }
       })
    })

    module.exports=commentsRouter;