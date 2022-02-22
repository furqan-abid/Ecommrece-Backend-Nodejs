const express = require('express')
const cors = require('cors')
const app = express();

const whitelist = ['http://localhost:3001']

let corsoptiondelegate=(req,cb)=>{
    let corsoptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1)
    {
        corsoptions={origin: true};
    }
    else{
        corsoptions={origin: false}
    }
    cb(null,corsoptions)
}

exports.cors=cors();
exports.corswithoptions= cors(corsoptiondelegate)