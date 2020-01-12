const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("./User")



router.get("/users/create", (req, res) =>{
  res.render("users/create")
})
router.post("/users/save", (req, res) =>{
  var name = req.body.name
  var email = req.body.email
  var password = req.body.password

  User.findOne({ where: { email: email } }).then(user =>{
    if(user != undefined){
      res.redirect("users/create")
    }else{
      var salt = bcrypt.genSaltSync(10)
      var hash = bcrypt.hashSync(password, salt)

      User.create({
        name: name,
        email: email,
        password: hash
      }).then(() =>{
        res.redirect("/login")
      })
    }
  })  
})
router.get("/users/login", (req, res) =>{
  res.render("users/login")
})

router.post("/login", (req, res) =>{
    var email = req.body.email
    var password = req.body.password
    var name = req.body.name

    User.findOne({ where: {email: email} }).then(user =>{
      if(user != undefined){
        var correct = bcrypt.compareSync(password, user.password)
        if(correct){
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name           
          }
          res.redirect("/panel")
        }else{
          res.redirect("/users/login")
        }
      }else{
        res.redirect("/users/login")
      }
    })
  })
router.get("/logout", (req, res) =>{
  req.session.user = undefined
  res.redirect("index")
})

module.exports = router