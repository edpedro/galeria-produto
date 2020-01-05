const express = require("express")
const app = express()
const bodyParser = require("body-parser")

//View engine
app.set("view engine", "ejs")

//Arquivo estaticos
app.use(express.static("public"))

//Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rotas




//Rota principal
app.get("/", (req, res) =>{
  res.send("ola mundo!")
})

//Conexão
app.listen(3000, () =>{
  console.log("Sevidor ON")
})