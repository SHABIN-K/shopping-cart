var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')
var cartHelper = require('../helpers/cart-helpers')

const verifyLogin = (req,res,next) =>{
  if(req.session.userLoggedIn){
    console.log(req.session.userLoggedIn);
    next()
  }else{
    console.log("user not login in");
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = req.session.user
  let cartCount=null
  if(user){
    cartCount=await cartHelper.getCartCount(user._id)
  }
  productHelper.getAllProducts().then((products) =>{
     res.render('user/view-products', { products, user, cartCount})
   })
});

/* GET signup page. */
router.get('/signup',(req, res) => {
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
    res.render('user/signup')
  }
  
})
router.post('/signup',(req, res)=>{
  userHelper.doSignup(req.body).then((response)=>{
      req.session.user = response
      req.session.userLoggedIn = true
      res.redirect('/')
  }).catch((err) => {
    console.log(err)
    res.redirect('/signup')
  })
})


/* GET Login page. */
router.get('/login', (req,res) => {
  if(req.session.userLoggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginError": req.session.loginError})
    req.session.loginError=false
  }
});

router.post('/login', (req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.userLoggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginError="invalid email or password"
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req,res) => {
  req.session.destroy()
  res.redirect('/')
});

/* GET Cart page. */
router.get('/cart',verifyLogin, async (req,res) => {
  let userID =req.session.user._id
  let user = req.session.user
  let products =await cartHelper.getCartProducts(userID)
 // console.log(products);
  res.render('user/cart', {products,user})
});

router.get('/add-to-cart/:id',(req,res) => {
  let proID = req.params.id
  let userID =req.session.user._id
  cartHelper.addToCart(proID,userID).then(() => {
    res.json({status:true})
    //res.redirect('/cart')
  })
});

router.post('/change-product-quantity',async (req,res) =>{
 await cartHelper.changeProductQuantity(req.body).then((response) => {
   // console.log('quantity changed');
   res.json({status:true})
  })
});


module.exports = router;
