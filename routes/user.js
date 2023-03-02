var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')


/* GET home page. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products) =>{
    // console.log(products)
     res.render('user/view-products', { products, admin:false })
   })
});

/* GET Login page. */
router.get('/login', (req,res) => {
  res.render('user/login')
});

/* GET signup page. */
router.get('/signup', (req,res) => {
  res.render('user/signup')
});

router.post('/signup', (req,res) => {
  res.render('user/signup')
});

module.exports = router;
