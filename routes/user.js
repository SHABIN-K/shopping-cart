var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')
var cartHelper = require('../helpers/cart-helpers')
var placeOrderHelper = require('../helpers/place-order')
var userOrderHelper = require('../helpers/order-helpers')
var paymentHelper = require('../helpers/payment-helper')

const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    //console.log(req.session.userLoggedIn);
    next();
  } else {
   // console.log("user not login in");
    res.redirect('/login');
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
    // console.log(products);
     res.render('user/view-products', { products, user, cartCount})
   })
});

/* GET signup page. */
router.get('/signup',(req, res) => {
  if(req.session.userLoggedIn){
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
    //console.log(err)
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
  let user = req.session.user
  let userID =user._id
  let total =0
  let products =await cartHelper.getCartProducts(userID)
  if(products.length>0){
     total= await placeOrderHelper.getTotalAmount(userID)
  }   
  //console.log(user);
  res.render('user/cart', {products,user,total})
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
 await cartHelper.changeProductQuantity(req.body).then(async(response) => {
   // console.log('quantity changed');
   let userID =req.body.user
   response.totalAmount = await placeOrderHelper.getTotalAmount(userID) 
   res.json(response)
  })
});

router.post("/remove-item", async (req, res) => {
 // console.log('remove-item api call');
 await cartHelper.removeItem(req.body).then((response) => {
    res.json(response)
  })
});

router.get("/place-order",verifyLogin, async(req, res) => {
  //console.log("place order api call");
  let userID =req.session.user._id
  let user = req.session.user
  let total= await placeOrderHelper.getTotalAmount(userID)
  let userDetails = await userHelper.getUserDetails(userID)
  res.render('user/place-order',{total,user,userDetails})
});

router.post("/place-order", async(req, res) => {
  let userID = req.body.userId    
  let products = await placeOrderHelper.getCartProductList(userID)
  let totalAmount = await placeOrderHelper.getTotalAmount(userID)
 // console.log("api call place order");
  placeOrderHelper.placeOrder(req.body,products,totalAmount).then((orderID) => {
    if(req.body['payment-method'] === 'COD'){
      res.json({codSuccess:true})
    }else {
      paymentHelper.generateRazorpay(orderID,totalAmount).then((response)=> {
        res.json(response)
      })
    }
  })  
});

router.get("/order-success",verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('user/order-success',{user})
});

router.get("/orders",verifyLogin, async(req, res) => {
  let user = req.session.user
  let userID =req.session.user._id
  let orders = await userOrderHelper.getUserOrders(userID)
  //console.log(orders);
  res.render('user/orders-view',{user,orders})
});

router.get("/view-order-product/:id",verifyLogin, async(req, res) => {
  let user = req.session.user
  let product = await userOrderHelper.getOrderProducts(req.params.id)
  res.render('user/view-order',{user,product})
});

router.post("/verify-payment", (req, res) => {
  paymentHelper.verifyPayment(req.body).then(() =>{
    paymentHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      //console.log("payment successfull");
      res.json({status:true})
    })
  }).catch((err)=>{
   // console.log(err);
    res.json({status:false,err})
  })
});

module.exports = router;
