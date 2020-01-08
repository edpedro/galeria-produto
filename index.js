const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")


//Controller
const UserController = require("./users/UserController")
const ProductController = require("./products/ProductController")
const DisplayController = require("./display/DisplayController")

//Model
const Product = require("./products/Product")


//View engine
app.set("view engine", "ejs")

//Arquivo estaticos
app.use(express.static("public"))

//Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Database
connection.authenticate().then(() =>{
  console.log("conectado")
}).catch(erro =>{
  console.log(erro)
})

//Rotas
app.use("/",UserController)
app.use("/",ProductController)
app.use("/",DisplayController)


//Rota principal
app.get("/", (req, res) =>{
  res.render("index")
})

//Conexão
app.listen(3000, () =>{
  console.log("Sevidor ON")
})