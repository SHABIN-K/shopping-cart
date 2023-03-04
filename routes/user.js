
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')


/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  productHelper.getAllProducts().then((products) =>{
     res.render('user/view-products', { products, user})
   })
});

/* GET signup page. */
router.get('/signup', (req,res) => {
   if(req.session.loggedIn){
     res.redirect('/')
   }else{
     res.render('user/signup')
   }
});


router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((userData) => {
    console.log("User signed up successfully");
    userHelper.doLogin(userData).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect('/');
        console.log("User logged in successfully");
      } else {
        res.redirect('/login');
        console.log("User login failed");
      }
    });
  }).catch((err) => {
    console.log("Error in signup: " + err);
    res.redirect('/signup');
  });
});



/* GET Login page. */
router.get('/login', (req,res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login')
  }
});

router.post('/login', (req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req,res) => {
  req.session.destroy()
  res.redirect('/')
});

module.exports = router;
