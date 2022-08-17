const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/connection');
const session = require('express-session');

const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const usersController = require('./users/usersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

const PORT = 4000;

//Sessions
app.use(session({
    //Expressão para aumentar a segurança
    secret: "qualquercoisa",
    //maxAge é o tempo máximo que a sessão durará antes de ser encerrada automaticamente
    cookie: { maxAge: 300000}
}));

// View Engine Configuration
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

// Body parser

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão com o DB realizada com sucesso');
    })
    .catch(error => {
        console.log(error);
    })

// Definindo as rotas
app.use('/', categoriesController, articlesController, usersController);

//Definindo uma rota padrão
app.get("/", (req, res) => {

    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then((articles) =>{
            Category.findAll().then(categories => {
                res.render('index.ejs', {articles: articles, categories: categories, session: session});
            });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render('article', {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch((error)=>{
        res.redirect("/");
    });

});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {
                    articles: category.articles,
                    categories: categories, 
                    session: session
                });
            });
        
        }else{
            res.redirect("/");
        }
    }).catch((err)=>{
        res.redirect("/");
    });
});

//Iniciando o servidor
app.listen(PORT, (req, res) => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});