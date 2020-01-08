const express = require("express")
const router = express.Router()
const Product = require("../products/Product")


router.get("/display", (req, res) => {
  Product.findAll().then(products => {
    res.render("display/index", { products: products })
  })
})



module.exports = router