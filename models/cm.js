"use strict";

const driver = require('./db');
const session = driver.session();


//创建群体模型
//完成
exports.createCM = (CMId)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'MERGE (m:CollectiveModel {modelID: $CMId}) RETURN m',
                {CMId: CMId}
            )
            .then(value => {
                const singleRecord = value.records[0];
                const node = singleRecord.get(0);
                return resolve(node);
            }, err => {
                return reject(err);
            });
    });
}

//更新群体模型上的用户
//完成
exports.addUserInCM = (CMId,userID)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'MATCH (u:User {userID: $userID}), (m:CollectiveModel {modelID: $CMId})' +
                'MERGE (u)-[r:ENROLLED_IN]->(m)' +
                'RETURN r',
                {userID: userID, CMId: CMId}
            )
            .then(value => {
                const singleRecord = value.records[0];
                const relationship = singleRecord.get(0);
                return resolve(relationship);
            }, err => {
                return reject(err);
            });
    });
}

//删除群体模型上的用户
//完成
exports.removeUserInCM = (CMId,userID)=>{
    return new Promise(function (resolve, reject) {
        session
        .run(
            'MATCH (User {userID: $userID}) -[r:ENROLLED_IN]-> (CollectiveModel {modelID: $CMId})' +
            'DELETE r',
            {userID:userID,CMId: CMId}
        )
        .then(value => {
            //console.log(value)
            //session.close();
            //const singleRecord = value.records[0];
            //const relationship = singleRecord.get(0);
            //console.log(node.type+"\n\n");
            return resolve(value);
        }, err => {
            return reject(err);
        });
    });
}

//获取群体模型
/*
exports.getCM = (CMId)=>{
    //Bug，存在边的时候才能删除边
    session
        .run(
            'MATCH (m:CollectiveModel {modelID: $CMId})' +
            'MATCH (n)-[r:ENROLLED_IN]->(m)'+
            'RETURN r',
        )
        .then(value => {
            //session.close();
            let err= null,doc=value;
            return callback(err,doc);
        });
}
*/

//获取个体模型
//未完成
exports.getIM = (CMId,userID)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'MATCH (m:CollectiveModel {modelID: $CMId})' +
                'MATCH (n)-[r:ENROLLED_IN]->(m)' +
                'WHERE ' + userID + 'IN r.userList' +
                'RETURN r',
            )
            .then(value => {
                //session.close();
                return resolve(value);
            }, err => {
                return reject(err);
            });
    });
};

//获取推荐
/*
exports.getRecommend = (CMId,eID)=>{
    session
        .run(
            'MATCH (m:CollectiveModel {modelID: $CMId})' +
            'MATCH (n)-[r:ENROLLED_IN]->(m)'+
            'WHERE '+userID+'IN r.userList'+
            'RETURN r',
        )
        .then(value => {
            //session.close();
            let err= null,doc=value;
            return callback(err,doc);
        });
};
*/


//获取Entity
//此处有错误
exports.getEntity = (CMId,userID,entityType,propertyType,propertyValue)=>{
    return new Promise(function (resolve, reject) {
        session
        .run(
            'MATCH (m:CollectiveModel {modelID: $CMId})' +
            'MATCH (v:Value {value:$propertyValue})-[:BELONGS_TO]->(m)' +
            'MERGE (e)-[l1:PI]->(p:'+propertyType+')-[l2:PO]->(v)' +
            'RETURN e',
            {CMId: CMId,propertyValue:propertyValue}
        )
        .then(value => {
            //session.close();
            const singleRecord = value.records[0];
            if(singleRecord == undefined)   return resolve(undefined);
            else{
                const node = singleRecord.get(0);
                return resolve(node);
            }
        }, err => {
            return reject(err);
        });
    });
}

//新增Entity
//完成
exports.addEntity = (CMId,userID,entityType)=>{
    return new Promise(function (resolve, reject) {
        session
        .run(
            'MATCH (m:CollectiveModel {modelID: $CMId})' +
            'CREATE (e:'+ entityType +')-[:BELONGS_TO]->(m)' +
            'RETURN e',
            {userID:userID,CMId: CMId}
        )
        .then(value => {
            const singleRecord = value.records[0];
            const node = singleRecord.get(0);
            return resolve(node);
        }, err => {
            return reject(err);
        });
    });
}


//引用Entity
//不需要该操作


//去引用(删除)Entity
//未完成，应该要用CASE,不然对于空数据会报错
exports.deRefEntity  = (CMId,userID,entityID)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'START e=node('+ entityID +')' +
                'MATCH ()-[l1]->(e)'+
                'WHERE EXISTS(l1.userList)'+

                'MATCH (e)-[:RI]->()-[l3:RO]->()'+
                'WHERE EXISTS(l3.userList)'+

                'MATCH ()-[l4:RI]->()-[:RO]->(e)'+
                'WHERE EXISTS(l4.userList)'+

                'SET l1.userList = FILTER(x IN l1.userList WHERE x <> "' + userID + '")'+
                'SET l3.userList = FILTER(x IN l3.userList WHERE x <> "' + userID + '")'+
                'SET l4.userList = FILTER(x IN l4.userList WHERE x <> "' + userID + '")'+

                'RETURN e',
                {entityID:entityID,CMId: CMId}
            )
            .then(value => {
                //session.close();
                const singleRecord = value.records[0];
                const node = singleRecord.get(0);
                //console.log(node.identity);
                return resolve(node);
            }, err => {
                return reject(err);
            });
    });
}


//新增EntityProperty
//完成，但是没有检测是否已存在
exports.addEntityProperty = (CMId,userID,entityID,propertyType,propertyValue)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'START e=node('+ entityID +')' +
                'MATCH (m:CollectiveModel {modelID: $CMId})' +
                'MERGE (v:Value {value:$propertyValue})-[:BELONGS_TO]->(m)' +   //(创建并)引用值节点
                //Q:这里好像需要用where限制，不然会将其他模型中的节点加入
                //'MERGE (e)-[l1:PI]->(p:'+propertyType+')' +
                //'MERGE (p)-[l2:PO]->(v)' +
                'MERGE (e)-[l1:PI]->(p:'+propertyType+')-[l2:PO]->(v)' +
                'MERGE (p)-[:BELONGS_TO]->(m)' +   //将p节点加入到模型m中
                'SET l1.userList = '+
                    'CASE WHEN NOT (EXISTS(l1.userList))' +
                        'THEN ["' + userID + '"]' +
                        'ELSE (l1.userList+["'+userID+'"])' +
                    'END \ '+ //不知道为什么不写\，return老是报错
                'SET l2.userList = '+
                    'CASE WHEN NOT (EXISTS(l2.userList))' +
                    'THEN ["' + userID + '"]' +
                    'ELSE (l2.userList+["'+userID+'"])' +
                    'END \ '+ //不知道为什么不写\，return老是报错
                'RETURN p',
                {entityID:entityID,CMId: CMId,propertyType:propertyType,propertyValue:propertyValue}
            )
            .then(value => {
                //session.close();
                const singleRecord = value.records[0];
                const node = singleRecord.get(0);
                return resolve(node);
            }, err => {
                return reject(err);
            });
    });
}

//引用EntityProperty
//暂时，新增和引用是一样的
exports.refEntityProperty = exports.addEntityProperty;

exports.deRefEntityProperty  = (CMId,userID,entityID,propertyType,propertyValue)=>{
    return new Promise(function (resolve, reject) {
        session
        .run(
            'START e=node('+ entityID +')' +
            'MATCH (e)-[l:'+ propertyType +']->(v:Value {value:$propertyValue})' +
            'WHERE EXISTS(l.userList)'+
            'SET l.userList = FILTER(x IN l.userList WHERE x <> "' + userID + '")'+

            'RETURN l',
            {entityID:entityID,CMId: CMId,propertyType:propertyType,propertyValue:propertyValue}
        )
        .then(value => {
            //session.close();
            const singleRecord = value.records[0];
            const node = singleRecord.get(0);
            return resolve(node);
        }, err => {
            return reject(err);
        });
    });
}

//新增Relationship
//完成
exports.addRelation = (CMId,userID,relationType,sourceId,targetId)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'START s=node('+ sourceId +'),' +
                't=node('+ targetId +')' +
                'MATCH (m:CollectiveModel {modelID: $CMId})' +

                'MERGE (s)-[l1:RI]->(r:'+ relationType +')-[l2:RO]->(t)' +
                'MERGE (r)-[:BELONGS_TO]->(m)' +   //这句没想好要不要

                'SET l1.userList = '+
                    'CASE WHEN NOT (EXISTS(l1.userList))' +
                    'THEN ["' + userID + '"]' +
                    'ELSE (l1.userList+["'+userID+'"])' +
                'END \ '+ //不知道为什么不写\，return老是报错

                'SET l2.userList = '+
                    'CASE WHEN NOT (EXISTS(l2.userList))' +
                    'THEN ["' + userID + '"]' +
                    'ELSE (l2.userList+["'+userID+'"])' +
                'END \ '+ //不知道为什么不写\，return老是报错

                'RETURN r',
                {userID:userID,CMId: CMId}
            )
            .then(value => {
                //session.close();
                const singleRecord = value.records[0];
                const relation = singleRecord.get(0);
                //console.log(relation);
                return resolve(relation);
            }, err => {
                return reject(err);
            });
    });
}

//引用Relationship
//假设只能有一个同类型关系的话，同add
exports.refRelation = exports.addRelation;

//去除引用RefRelation
exports.deRefRelation = (CMId,userID,relationType,sourceId,targetId)=>{

    return new Promise(function (resolve, reject) {
        session
            .run(
                'START s=node('+ sourceId +'),t=node('+ targetId +')' +
                'MATCH (m:CollectiveModel {modelID: $CMId})' +
                'MATCH (s)-[l1:RI]->(r:'+ relationType +')-[l2:RO]->(t)' +
                'SET l1.userList = FILTER(x IN l1.userList WHERE x <> "' + userID + '")'+
                'SET l2.userList = FILTER(x IN l2.userList WHERE x <> "' + userID + '")'+
                'RETURN r',
                {CMId: CMId,userID:userID,relationType:relationType,sourceId:sourceId,targetId:targetId}
            )
            .then(value => {
                //session.close();
                const singleRecord = value.records[0];
                const relation = singleRecord.get(0);
                return resolve(relation);
            }, err => {
                //console.log(err);
                return reject(err);
            });
    });
}

//增加Relationship.Property的用户引用
exports.addRelationProperty = (CMId,userID,relationID,propertyType,propertyValue)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'START e=node('+ relationID +')' +
                'MATCH (m:CollectiveModel {modelID: $CMId})' +

                'MERGE (v:Value {value:$propertyValue})-[:BELONGS_TO]->(m)' +
                'MERGE (e)-[r:'+ propertyType +']->(v)' +

                'SET r.userList = '+
                    'CASE WHEN NOT (EXISTS(r.userList))' +
                    'THEN ["' + userID + '"]' +
                    'ELSE (r.userList+["'+userID+'"])' +
                    'END \ '+ //不知道为什么不写\，return老是报错
                'RETURN r',
                {CMId: CMId,userID:userID,relationID:relationID,propertyType:propertyType,propertyValue:propertyValue}
            )
            .then(value => {
                //session.close();
                const singleRecord = value.records[0];
                const node = singleRecord.get(0);
                return resolve(node);
            }, err => {
                return reject(err);
            });
    });
}

exports.refRelationProperty = exports.addRelationProperty;

//去除引用RelationProperty
exports.deRefRelationProperty  = (CMId,userID,relationID,propertyType,propertyValue)=>{
    return new Promise(function (resolve, reject) {
        session
            .run(
                'START e=node('+ relationID +')' +
                'MATCH (e)-[l:'+ propertyType +']->(v:Value {value:$propertyValue})' +
                'WHERE EXISTS(l.userList)'+
                'SET l.userList = FILTER(x IN l.userList WHERE x <> "' + userID + '")'+

                'RETURN e',
                {CMId: CMId,userID:userID,relationID:relationID,propertyType:propertyType,propertyValue:propertyValue}
            )
            .then(value => {
                //session.close();
                const singleRecord = value.records[0];
                const node = singleRecord.get(0);
                return resolve(node);
            }, err => {
                return reject(err);
            });
    });
}



