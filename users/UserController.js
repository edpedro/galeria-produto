const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("./User")
const { check, validationResult } = require("express-validator")

router.get("/users/create", (req, res) => {
  res.render("admin/users/create", { erros: {}, msg: req.flash('msg') })
})
router.post("/users/save", [
  //Validação
  check('email', "Favor inserir email valido").isEmail(),
  check('password', "Favor inserir senha maior de 5").isLength({ min: 5 }),
  check('name', "Favor preencher o campo").not().isEmpty()

], (req, res) => {

  const erros = validationResult(req)
  //Tratamento de erro
  if (!erros.isEmpty()) {
    res.render("admin/users/create", { erros: erros.mapped(), msg: '' })
  } else {

    var name = req.body.name
    var email = req.body.email
    var password = req.body.password

    User.findOne({ where: { email: email } }).then(user => {
      if (user != undefined) {
        req.flash('msg', 'Email já existe')
        res.redirect("/admin/create")
      } else {
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(password, salt)

        User.create({
          name: name,
          email: email,
          password: hash
        }).then(() => {
          res.redirect("/admin/users/create")
        })
      }
    }).catch((error) => {
      req.flash('msg', 'Erro, Favor preencher todos campos')
      res.redirect("/admin/users/create")
    })
  }
})
router.get("/users/login", (req, res) => {
  res.render("admin/users/login", { erros: {}, msg: req.flash('msg') })
})

router.post("/login",  [
  //Validação
  check('email', "Favor inserir email valido").isEmail(),
  check('password', "Favor inserir senha maior de 5").isLength({ min: 5 }),
],(req, res) => {

  const erros = validationResult(req)
  if (!erros.isEmpty()) {
    res.render("admin/users/login", { erros: erros.mapped(), msg: '' })

  } else {
    var email = req.body.email
    var password = req.body.password
    var name = req.body.name

    User.findOne({ where: { email: email } }).then(user => {
      if (user != undefined) {
        var correct = bcrypt.compareSync(password, user.password)
        if (correct) {
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name
          }
          req.flash('msg', 'Logado com sucesso')
          res.redirect("/")
        } else {
          req.flash('msg', 'Email ou Senha invalido')
          res.redirect("/admin/users/login")
        }
      } else {
        req.flash('msg', 'Email ou Senha invalido')
        res.redirect("/admin/users/login")
      }
    })
  }
})
router.get("/logout", (req, res) => {
  req.session.user = undefined
  res.redirect("/")
})

module.exports = router