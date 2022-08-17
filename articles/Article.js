const Sequelize = require('sequelize');
const connection = require('../database/connection');
const Category = require('../categories/Category');

const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); //Uma categoria tem muitos artigos (relação 1-p-n)
Article.belongsTo(Category); //Um artigo pertence a uma categoria (relação 1-p-1)

module.exports = Article;