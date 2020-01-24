const express = require("express")
const router = express.Router()
const Product = require("./Product")
const multer = require("multer")
const path = require("path")
const adminAuth = require("../middleware/adminAuth")
const { check, validationResult } = require("express-validator")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage
})

router.get("/product/create", adminAuth, (req, res) => {
  Product.findAll().then(products => {
    res.render("admin/product/create", { erros: {}, msg: '', })
  });


})
//Salvar produtos
router.post("/product/save", adminAuth, upload.single("file"), (req, res) => {

  var imagem = req.file.filename
  var code = req.body.code
  var description = req.body.description
  var provider = req.body.provider
  var server = req.body.server
  Product.create({
    code: code,
    description: description,
    provider: provider,
    server: server,
    image: imagem
  }).then(() => {
    res.redirect("/product")
  })
})
//Listar produtos
router.get("/product", adminAuth, (req, res) => {
  Product.findAll({
    order: [
      ['id', 'DESC']
    ]
  }).then(products => {
    var quant = products.length
    res.render("admin/product/index", { products: products, quant: quant })
  })
})
//Deletar produtos
router.post("/product/delete", adminAuth, (req, res) => {
  var id = req.body.id
  if (id != undefined) {
    if (!isNaN(id)) {
      Product.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect("/product")
      })
    } else {
      res.redirect("/product")
    }
  } else {
    res.redirect("/product")
  }
})
//Editar produtos
router.get("/product/edit/:id", adminAuth, (req, res) => {
  var id = req.params.id
  if (isNaN(id)) {
    res.redirect("/product")
  } else {
    Product.findByPk(id).then(products => {
      if (products != undefined) {
        res.render("admin/product/edit", { products: products })
      } else {
        res.redirect("/product")
      }
    }).catch(erro => {
      res.redirect("/product")
    })
  }
})
//Atualizar Produto
router.post("/product/update", upload.single("file"), (req, res) => {
  var id = req.body.id
  var code = req.body.code
  var description = req.body.description
  var provider = req.body.provider
  var server = req.body.server
  var imagem = req.file.filename

  Product.update({
    code: code,
    description: description,
    provider: provider,
    server: server,
    imagem: imagem
  },
    {
      where: {
        id: id
      }
    }
  ).then(() => {
    res.redirect("/admin/product")
  })
})


module.exports = router