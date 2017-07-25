"use strict";

const driver = require('./db');
const session = driver.session();

//创建群体模型
exports.createUser = (userID) => {
    return new Promise(function (resolve, reject) {
        session
        .run(
            'MERGE (u:User {userID: $userID}) RETURN u',
            {userID: userID}
        )
        .then(value => {
            //session.close();
            const singleRecord = value.records[0];
            const node = singleRecord.get(0);
            //console.log(node.properties.userID+"\n\n");
            return resolve(value);
        }, err => {
            return reject(err);
        });
    });
}