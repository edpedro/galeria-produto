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

router.get("/product/create", (req, res) => {
  res.render("product/create")
})
//Salvar produtos
router.post("/products/save", upload.single("file"), (req, res) => {
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
    res.redirect("product")
  })
  
})
//Listar produtos
router.get("/product/index", (req, res) => {
  Product.findAll({
    order:[
      ['id', 'DESC']
    ]
  }).then(products =>{
    var quant = products.length
    res.render("product/index", {products: products, quant: quant})
  })  
})
//Deletar produtos
router.post("/products/delete", (req, res) =>{
  var id = req.body.id
  if(id != undefined){
    if(!isNaN(id)){
      Product.destroy({
        where:{
          id: id
        }
      }).then(() =>{
        res.redirect("/product/index")
      })
    }else{
      res.redirect("/product/index")
    }
  }else{
    res.redirect("/product/index")
  }
})

module.exports = router