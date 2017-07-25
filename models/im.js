"use strict";

const cm = require('./cm');

//数据格式转换
//id映射关系

const offset = {
    time: 0,
    operation: 1,
    operationType: 2,

    ENT:{
        id: 3,
        type: 4,
        property:5
    },
    EPR:{
        id:3,
        property:4
    },
    RLT:{
        relationID:3,
        sourceId:4,
        targetId:5,
        type:6,
        direction:7,
        property:8
    },
    RPR:{
        relationID:3,
        property:4
    }
}

function getNewId(oldId,idMap){
    if(idMap[oldId] != undefined) return idMap[oldId];
    else return oldId;
}


exports.addEntity = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        cm.getEntity(CMId, userID, operation[offset.ENT.type], operation[offset.ENT.property][0][0], operation[offset.ENT.property][0][1])
            .then(node=>{
                if (node === undefined) {
                    cm.addEntity(CMId, userID, operation[offset.ENT.type])
                        .then(node=>{
                            let id = node.identity;
                            idMap[offset.ENT.id] = id;

                            let opArray = [];
                            for (let key in operation[offset.ENT.property]) {
                                opArray.push(cm.addEntityProperty(CMId, userID, id, operation[offset.ENT.property][key][0], operation[offset.ENT.property][key][1]))
                            }
                            Promise.all(opArray)
                                .then(values => resolve(idMap))
                                .catch(errs =>reject(errs));
                        })
                        .catch(err=>reject(err));
                } else {
                    let id = node.identity;
                    idMap[offset.ENT.id] = id;

                    let opArray = [];
                    for (let key in operation[offset.ENT.property]) {
                        opArray.push(cm.addEntityProperty(CMId, userID, id, operation[offset.ENT.property][key][0], operation[offset.ENT.property][key][1]))
                    }
                    Promise.all(opArray)
                        .then(values => resolve(idMap))
                        .catch(errs =>reject(errs));
                }
            })
            .catch(err=>reject(err));
    });
}

exports.addEntityProperty = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        let id = operation[offset.EPR.id];

        //id = getNewId(id,idMap);

        let opArray = [];
        for (let key in operation[offset.EPR.property]) {
            opArray.push(cm.refEntityProperty(CMId, userID, id, operation[offset.EPR.property][key][0], operation[offset.EPR.property][key][1]))
        }
        Promise.all(opArray)
            .then(values => resolve(idMap))
            .catch(errs => reject(errs));
    });
}


exports.addRelation = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        const direction = operation[offset.RLT.direction];
        let opArray = [];
        opArray.push(addDirectedRelation(CMId,userID,operation,idMap,1));
        if(direction == 0) opArray.push(addDirectedRelation(CMId,userID,operation,idMap,-1));
        Promise.all(opArray)
            .then(values => resolve(idMap))
            .catch(errs => reject(errs));
    });
}

const addDirectedRelation = function (CMId,userID,operation,idMap,direction){
    return new Promise(function (resolve, reject) {
        let sourceId,targetId;
        if(direction == 1){
            sourceId = operation[offset.RLT.sourceId];
            targetId = operation[offset.RLT.targetId];
        }else{
            targetId = operation[offset.RLT.sourceId];
            sourceId = operation[offset.RLT.targetId];
        }

        //sourceId = getNewId(sourceId,idMap);
        //targetId = getNewId(targetId,idMap);

        //if direction == 1;
        cm.addRelation(CMId,userID,operation[offset.RLT.type],sourceId,targetId)
            .then(relation=>{
                let id = relation.identity;
                if(offset.RLT.id != id) idMap[offset.RLT.id] = id;

                let opArray = [];
                if(operation[offset.RLT.property]!= undefined){
                    for (let key in operation[offset.RLT.property]) {
                        opArray.push(cm.addRelationProperty(CMId, userID, id, operation[offset.RLT.property][key][0], operation[offset.RLT.property][key][1]))
                    }
                    Promise.all(opArray)
                        .then(values => resolve(idMap))
                        .catch(errs =>reject(errs));
                }else{
                    return resolve(relation)
                }
            })
            .catch(err=>resolve(err))
    });
}

exports.addRelationProperty = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        let id = operation[offset.RPR.id];

        //id = getNewId(id,idMap);

        let opArray = [];
        for (let key in operation[offset.RLT.property]) {
            opArray.push(cm.addRelationProperty(CMId, userID, id, operation[offset.RLT.property][key][0], operation[offset.RLT.property][key][1]))
        }
        Promise.all(opArray)
            .then(values => resolve(idMap))
            .catch(errs =>reject(errs));
    });
}


exports.refEntity = exports.addEntityProperty;
exports.refRelation = exports.addRelation;


exports.removeRelation = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        const direction = operation[offset.RLT.direction];
        let opArray = [];
        opArray.push(removeDirectedRelation(CMId,userID,operation,idMap,1));
        if(direction == 0) opArray.push(removeDirectedRelation(CMId,userID,operation,idMap,-1));
        Promise.all(opArray)
            .then(values => resolve(idMap))
            .catch(errs => reject(errs));
    });
}

const removeDirectedRelation = function (CMId,userID,operation,idMap,direction){
    return new Promise(function (resolve, reject) {
        let sourceId,targetId;
        if(direction == 1){
            sourceId = operation[offset.RLT.sourceId];
            targetId = operation[offset.RLT.targetId];
        }else{
            targetId = operation[offset.RLT.sourceId];
            sourceId = operation[offset.RLT.targetId];
        }
        //if direction == 1;
        cm.deRefRelation(CMId,userID,operation[offset.RLT.type],sourceId,targetId)
            .then(relation=>resolve(idMap))
            .catch(err=>resolve(err))
    });
}


exports.removeEntityProperty = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        let id = operation[offset.EPR.id];

        let opArray = [];
        for (let key in operation[offset.EPR.property]) {
            opArray.push(cm.deRefEntityProperty(CMId, userID, id, operation[offset.EPR.property][key][0], operation[offset.EPR.property][key][1]))
        }
        Promise.all(opArray)
            .then(values => resolve(idMap))
            .catch(errs => reject(errs));
    });
}

exports.removeRelationProperty = function (CMId,userID,operation,idMap){
    return new Promise(function (resolve, reject) {
        let id = operation[offset.RPR.id];

        let opArray = [];
        for (let key in operation[offset.PR.property]) {
            opArray.push(cm.deRefEntityProperty(CMId, userID, id, operation[offset.EPR.property][key][0], operation[offset.EPR.property][key][1]))
        }
        Promise.all(opArray)
            .then(values => resolve(idMap))
            .catch(errs => reject(errs));
    });
}

