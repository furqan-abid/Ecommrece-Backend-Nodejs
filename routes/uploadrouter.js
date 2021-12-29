const express = require('express');
const bodyparser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const imagefilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('you can only upload image files'),false)
    }
    cb(null,true)
}

const upload = multer({storage:storage,fileFilter:imagefilter});

const uploadrouter = express.Router();
uploadrouter.use(bodyparser.json())
uploadrouter.route('/')
.get(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('get operation is not supported')
})
.put(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('put operation is not supported')
})
.post(authenticate.verifyuser,authenticate.verifyadmin,upload.single('imageFile'),(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json')
    res.json(req.file)
})
.delete(authenticate.verifyuser,authenticate.verifyadmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('delete operation is not supported')
})

module.exports = uploadrouter;