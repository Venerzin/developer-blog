const Sequelize = require('sequelize');

const connection = new Sequelize('developerblog', 'root', 'SV112272454BR', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;