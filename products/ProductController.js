const express = require("express")
const router = express.Router()
const Product = require("./Product")

router.get("/products/create", (req, res) => {
  res.render("product/create")
})

router.post("/produtcs/save", (req, res) => {

  var code = req.body.code
  var description = req.body.description
  var provider = req.body.provider
  var server = req.body.server

  Product.create({
    code: code,
    description: description,
    provider: provider,
    server: server
  }).then(() => {
    res.redirect("index")
  })
})

module.exports = router