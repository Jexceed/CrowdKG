const express = require('express');
const router = express.Router();


const operation = require('../models/operation');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('test', { title: '前台操作测试' });
});

router.post('/', function(req, res, next) {
    //console.log(req.body);
    let count = 0;
    let CMId,userID,op=[];
    for(let key in req.body){
        if(count == 0){
            CMId=req.body[key];
            //console.log(CMId);
            count++;
            continue;
        }
        if(count == 1){
            userID=req.body[key];
            //console.log(userID);
            count++;
            continue;
        }
        if(count == 2){
            op.push(req.body[key],[]);
            //console.log(op);
            count++;
            continue;
        }else{
            op[1].push(req.body[key]);
            //console.log(op);
            count++;
            continue;
        }
    }
    op = [...op[0],op[1]];


    operation.allocateOperation(CMId,userID,op)
        .then(idMap=>{
            console.log(idMap);
            //res.status(null).send(idMap)
        })
        .catch(err=>{
            console.log(err);
            //res.status(err).send(idMap)
        })

});

module.exports = router;
