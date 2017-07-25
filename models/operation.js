const cm = require('./cm');
const im = require('./im');
const user = require('./user');


exports.allocateOperation = function(CMId,userID,operation){
    return new Promise(function (resolve, reject) { //多操作的话，可能会改
        let idMap = {};

        let operaStr = operation[1]+"_"+operation[2];
        console.log("操作信息")
        console.log(CMId)
        console.log(userID)
        console.log(operation)
        console.log("\n\n")

        //let func;
        switch (operaStr){
            case "ADD_ENT":
                im.addEntity(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "ADD_EPR":
                im.addEntityProperty(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "ADD_RLT":
                im.addRelation(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "ADD_RPR":
                im.addRelationProperty(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "REF_ENT":
                im.refEntity(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "REF_RLT":
                im.refRelation(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "RMV_ENT":
                //暂时不写
                break;
            case "RMV_EPR":
                im.removeEntityProperty(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "RMV_RLT":
                im.removeRelation(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
            case "RMV_RPR":
                im.removeRelationProperty(CMId,userID,operation,idMap)
                    .then(idMap => {
                        resolve(idMap);
                    })
                    .catch(err => {
                        reject(err);
                    });
                break;
        }
    });
    //return func;
}

//exports.allocateOperation = allocateOperation;

/* 应该可以用geerator处理
function* allocateOperationx(CMId,userID,operations){
    for(let key in operations){
        yield allocateOperation(CMId,userID,operations[key])
    }
}

exports.run = function(CMId,userID,operations){
    for(let key in operations){
        allocateOperation(CMId,userID,operations[key])
    }
}
*/