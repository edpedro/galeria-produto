const express = require("express")
const router = express.Router()
const Product = require("../products/Product")


router.get("/display", (req, res) => {
  Product.findAll().then(products => {
    var quant = products.length
    res.render("display/index", { products: products, quant:quant  })
  })
})



module.exports = router