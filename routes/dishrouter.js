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
    .populate('comments.author')
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
    .populate('comments.author')
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

dishrouter.route('/:dishid/comments')
.options(cors.corswithoptions,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,(req,res,next)=>{
    dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish)=>{
        if(dish!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments)
        }
        else{
            const error=new Error('dihs '+req.params.dishid+" does not exist");
            error.status=404;
            return next(error);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    dishes.findById(req.params.dishid)
    .then((dish)=>{
        if(dish!=null){
            req.body.author=req.user._id
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(dish)
                })})
        }
        else{
            const error=new Error('dish '+req.params.dishid+" not found")
            error.status=404;
            return next(error)
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
    res.statusCode=403;
    res.end('put operation is not supported on '+req.params.dishid)
})
.delete(cors.corswithoptions,authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    dishes.findById(req.params.dishid)
    .then((dish)=>{
        if(dish!=null){
            for(let i=(dish.comments.length -1);i>=0;i--){
                dish.comments.id(dish.comments[i]._id.remove());
            }
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader("Content-Type","application/json")
                res.json(dish);
            },err=>next(err))
        }
        else{
            const error=new Error('dish '+req.params.dishid+" not found")
            error.status=404;
            return next(error)
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
    })

    dishrouter.route('/:dishid/comments/:commentid')
    .options(cors.cors,(req,res)=>{
        res.sendStatus(200)
    })
    .get(cors.cors,(req,res,next)=>{
        dishes.findById(req.params.dishid)
        .populate('comments.author')
        .then((dish)=>{
            if(dish!=null && dish.comments.id(req.params.commentid)!=null){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish.comments.id(req.params.commentid));
            }
            else if(dish==null){
                const error=new Error('dish '+req.params.dishid+" not found")
                error.status=404;
                return next(error)
            }
            else{    
                const error=new Error('comments '+req.params.commentid+" not found")
                error.status=404;
                return next(error)
            }
        },err=>next(err))
        .catch((err)=>next(err));
    })
    .post(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
        res.statusCode=403;
        res.end('post operation is not supported')
    })
    .put(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
        dishes.findById(req.params.dishid)
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentid) != null) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentid).rating = req.body.rating;
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentid).comment = req.body.comment;                
                }
                dish.save()
                .then((dish) => {
                    dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);  
                    })              
                }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishid + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentid + ' not found');
                err.status = 404;
                return next(err);            
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .delete(cors.corswithoptions,authenticate.verifyuser,(req,res,next)=>{
        dishes.findById(req.params.dishid)
        .then((dish)=>{
            if(dish!=null&&dish.comments.id(req.params.commentid)&&dish.comments.id(req.params.commentid).author._id.equals(req.user._id)){
               
                dish.comments.id(req.params.commentid).remove();
                dish.save()
                .then((dish)=>{
                    dishes.findById(dish._id)
                    .populate('comments.author')  
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json')
                        res.json(dish);
                    })
                })
            }
            else if(dish==null){
                const error=new Error('dish '+req.params.dishid+" not found")
                error.status=404;
                return next(error)
            }
            else if(dish.comments.id(req.params.commentid).author._id!=req.user._id){
                console.log(dish.comments.id(req.params.commentid).author._id)
                console.log(req.user._id)
                let err=new Error('you are not allowed to perform this operation')
                err.status=403;
                return next(err)
            }
            else{    
                const error=new Error('comments '+req.params.commentid+" not found")
                error.status=404;
                return next(error)
            }
        })
    })

module.exports = dishrouter;