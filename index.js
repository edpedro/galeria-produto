const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Session = require("express-session")
var flash = require('connect-flash');
var cookieParser = require('cookie-parser')


//Controller
const UserController = require("./users/UserController")
const ProductController = require("./products/ProductController")
const DisplayController = require("./display/DisplayController")


//Model
const Product = require("./products/Product")
const User = require("./users/User")

//Session
app.use(Session({
  secret: "projetogaleriaproduto",
  cookie: {maxAge: 9898489484848787874},
  proxy: true,
  resave: false,
  saveUninitialized: false
}))
//mensagem
app.use(cookieParser())
app.use(flash());


//View engine
app.set("view engine", "ejs")

//Arquivo estaticos
app.use(express.static("public"))

//Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Database
connection.authenticate().then(() => {
  console.log("conectado")
}).catch(erro => {
  console.log(erro)
})

//Rotas
app.use("/", UserController)
app.use("/", ProductController)
app.use("/", DisplayController)



//Rota principal
app.get("/", (req, res) => {
  res.render("index", {session: req.session.user, msg: req.flash('msg')})
})

//Search
app.get("/search", (req, res) => {
  var { search } = req.query
  search = search.toLowerCase()
  //pesquisar em varias colunas
  Product.findAll({
    where: {
      [Op.or]: [
        {
          code:{
             [Op.like]: '%' + search + '%'
           }
        }, 
        {
          provider:{
             [Op.like]: '%' + search + '%'
           }
        },     
        {
          description:{
             [Op.like]: '%' + search + '%'
           }
        },            
     ] 
  }
  }).then(searchs => {
      var quant = searchs.length
      res.render("search", { searchs: searchs, quant:quant, session: req.session.user })
    })
})

//Conexão
app.listen(3000, () => {
  console.log("Sevidor ON")
})