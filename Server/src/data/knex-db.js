const knext = require('knex');
const knextfile = require('../../knexfile');

const db = knext(knextfile.development);
module.exports = db;