const express = require("express")
const router = express.Router()
const Product = require("./Product")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/images/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname + Date.now() + path.extname(file.originalname))
  }
}) 

const upload = multer({
  storage
})

router.get("/products/create", (req, res) => {
  res.render("product/create")
})

router.post("/produtcs/save", upload.single("file"), (req, res) => {
  var imagem  =  req.file.filename  
  var code = req.body.code
  var description = req.body.description
  var provider = req.body.provider
  var server = req.body.server

  Product.create({
    code: code,
    description: description,
    provider: provider,
    server: server,
    imagem: imagem
  }).then(() => {
    res.redirect("display")
  })
  
})

module.exports = router