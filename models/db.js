"use strict";

const settings = require('../settings');
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(settings.db.uri, neo4j.auth.basic(settings.db.user, settings.db.password));
//const session = driver.session();

module.exports = driver;

/*
const personName = 'Alice';
const resultPromise = session.run(
    'CREATE (a:Person {name: $name}) RETURN a',
    {name: personName}
);

resultPromise.then(result => {
    session.close();

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log(node.properties.name);

    // on application exit:
    driver.close();
});
*/

/*
// Register a callback to know if driver creation failed.
// This could happen due to wrong credentials or database unavailability:
driver.onError = function (error) {
    console.log('Driver instantiation failed', error);
};

// Close the driver when application exits.
// This closes all used network connections.
//driver.close();
*/

