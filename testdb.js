"use strict";

const cm = require('./models/cm');
const im = require('./models/im');
const user = require('./models/user');

const op1 = [
    ["t1", "ADD", "ENT", "FRONTID_1","人物",[["名字","宝二爷"],["性别","男"]]],
    ["t2", "ADD", "EPR", "FRONTID_1",[["生日","12月29日"]]],

    ["t3", "ADD", "ENT", "FRONTID_2","人物",[["名字", "林黛玉"]]],
    ["t4", "ADD", "RLT", "FRONTID_RL","FRONTID_1", "FRONTID_2","知己",1]
]

const op2 = [
    ["t5", "REF", "ENT", "ENDID_1",[["名字", "贾宝玉"]]],
    ["t6", "ADD", "ENT", "ENDID_2","人物",[["名字", "林黛玉"]]],
    ["t7", "ADD", "RLT", "FRONTID_RL","ENDID_2", "ENDID_1","知己",1]
]

const op3 = [
    ["t8", "RMV", "RLT", "FRONTID_RL","136","129","知己", 1]
]


/*
const allocateOperation = function(CMId,userID,operation){
    let operaStr = operation[1]+"_"+operation[2];

    switch (operaStr){
        case "ADD_ENT":
            im.addEntity(CMId,userID,operation,idMap)
            break;
        case "ADD_EPR":
            im.addEntityProperty(CMId,userID,operation,idMap)
            break;
        case "ADD_RLT":
            im.addRelation(CMId,userID,operation,idMap)
            break;
        case "ADD_RPR":
            im.addRelationProperty(CMId,userID,operation,idMap)
            break;
        case "REF_ENT":
            im.refEntity(CMId,userID,operation,idMap)
            break;
        case "REF_RLT":
            im.refRelation(CMId,userID,operation,idMap)
            break;
        case "RMV_ENT":
            //暂时不写
            break;
        case "RMV_EPR":
            im.removeEntityProperty(CMId,userID,operation,idMap)
            break;
        case "RMV_RLT":
            im.removeRelation(CMId,userID,operation,idMap)
            break;
        case "RMV_RPR":
            break;
    }
}
*/
//*
cm.createCM("cm1")
    .then(value=> {
        user.createUser("u1").then(value=>{cm.addUserInCM("cm1", "u1").then(value=>{},err=>{})})
        user.createUser("u2").then(value=>{cm.addUserInCM("cm1", "u2").then(value=>{},err=>{})})
    },err=>{
        console.log(err);
    });
//*/


/*
im.addEntity("cm1","u1",op1[0],{})
    .then(value=>{console.log(value)})
    .catch(err=>console.log(err));
//*/

/*
im.addEntityProperty("cm1","u1",op1[1],{})
    .then(value=>{console.log(value)})
    .catch(err=>console.log(err));
//*/

//im.addEntity("cm1","u1",op1[2],{})
/*
im.addRelation("cm1","u1",op1[3],{})
    .then(value=>{console.log(value)})
    .catch(err=>console.log(err))
//*/
/*
im.removeRelation("cm1","u1",op3[0],{})
    .then(value=>{console.log(value)})
    .catch(err=>console.log(err))
//*/

//cm.deRefRelation("cm1","u1","知己","136","129");
/*
cm.createCM("cm1",function(str){
    user.createUser("u1",function() {cm.addUserInCM("cm1", "u1", function () {
         cm.addEntity("cm1","u1","Person",function(err,node){
             let id1 = node.identity;
             cm.addEntityProperty("cm1","u1",node.identity,"name","贾宝玉",function(){
                 cm.addEntity("cm1","u1","Person",function(err,node){
                     let id2 = node.identity;
                     cm.addEntityProperty("cm1","u1",node.identity,"name","林黛玉",function(){
                         cm.addRelation("cm1","u1","知己",id1,id2,function(){});
                     })
                 })
             })

         })
    })})
    user.createUser("u2",function(){cm.addUserInCM("cm1","u2",function(){})})
})
//*/




//cm.addEntity("cm1","u1",'Person',function(nodeID){console.log(nodeID)});
//cm.addEntityProperty("cm1","u1","163",'name','贾宝玉',function(){});
//cm.addEntityProperty("cm1","u1","164",'name','林黛玉',function(){});
//cm.addRelation("cm1","u1","知己","163","164",function(){});


/*
cm.createCM("cm1",function(str){
    console.log(str)
    user.createUser("u1",function(){
        cm.addUserInCM("cm1","u1",function(){
        //cm.removeUserInCM("cm1","u1",function(){
            let entity = {
                id: '123',
                type: 'Person'
            }
            cm.addEntity("cm1","u1",'Person',function(nodeID){
                console.log(nodeID);
                var id = nodeID.low;
                console.log(id);
                cm.refEntityProperty("cm1","u1",id,'name','贾宝玉',function(){
                    console.log("执行后");

                })
            })
        })
    })
})
//*/
//cm.addRelation("cm1","u1","wuli",53,54,function(){})
//cm.deRefEntity("cm1","u1",92,function(){})
//cm.deRefEntityProperty("cm1","u1",96,'name','贾宝玉',function(){})