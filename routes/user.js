const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')


/* GET home page. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products) =>{
    // console.log(products)
     res.render('user/view-products', { products, admin:false })
   })
});

/* GET signup page. */
router.get('/signup', (req,res) => {
  res.render('user/signup')
});

router.post('/signup', (req,res) => {

  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
  })
});

/* GET Login page. */
router.get('/login', (req,res) => {
  res.render('user/login')
});

router.post('/login', (req,res)=>{
  userHelper.doLogin(req.body)
  let pass = req.body;
  console.log(pass);
})

module.exports = router;
