const express = require("express")
const router = express.Router()
const Product = require("../products/Product")


router.get("/display", (req, res) => {
  Product.findAll({
    limit: 4
  }).then(products => {
    var quant = products.length
    res.render("display/index", { products: products, quant:quant, session: req.session.user  })
  })
})

//Paganição
router.get("/display/page/:num", (req, res) =>{
  var page = req.params.num;
  var offset = 0

  if(isNaN(page) || page == 1){
    offset = 0;
  }else{
    offset = (parseInt(page) -1) * 2;
  }

  Product.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [
      ['id', 'DESC']
    ]
  }).then(products =>{    
    var next;
    if(offset + 4 >= products.count){
      next = false
    }else{
      next = true
    }
   
    var result ={
      page: parseInt(page) , 
      next: next,
      products : products
        
    }
    res.render("display/page", {result: result, session: req.session.user, })
  })
})



module.exports = router