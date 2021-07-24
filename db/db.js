const massive = require('massive');
const { postgresql } = require('../config.json');
const config = require('../config.json');

let db;

exports = module.exports = function () {
  if (db) {
    return db;
  }

  return massive({
    host: postgresql.host,
    port: postgresql.port,
    database: postgresql.database,
    user: postgresql.user,
    password: postgresql.password,
    ssl: {
      rejectUnauthorized: false
    },
    poolsize: 25,
}).then(instance => {
    db = instance;

    return Promise.resolve(db);
  }).catch(error => {
    console.log('Massive Error: ', error)
  });
};