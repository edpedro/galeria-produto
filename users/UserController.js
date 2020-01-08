const express = require("express")
const router = express.Router()


router.get("/ce", (req, res) =>{
  res.render("users/create")
})
router.post("/save", (req, res) =>{
  res.render("users/login")
})
router.get("/login", (req, res) =>{
  res.render("users/login")
})


module.exports = router