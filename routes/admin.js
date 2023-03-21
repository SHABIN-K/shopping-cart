var express = require('express');
var router = express.Router();
var fs = require('fs')

var productHelper = require('../helpers/product-helpers')
var adminHelper = require('../helpers/admin-helper')
var userOrderHelper = require('../helpers/order-helpers')

const verifyAdminLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
   // console.log("admin already exits");
    next();
  } else {
    //console.log("user not login inn");
    res.redirect('/admin/login');
  }
}

/* GET Login page. */
router.get('/login', (req,res) => {
  if(req.session.admin){
    res.redirect('/admin/')
  }else{
    res.render('admin/login',{admin : true ,"loginError": req.session.adminloginError})
    req.session.adminloginError=false
  }
});

router.post('/login', (req,res)=>{
  adminHelper.adminLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin=response.admin
      req.session.adminLoggedIn=true
      res.redirect('/admin/')
    }else{
      req.session.adminloginError="invalid email or password"
      res.redirect('/admin/login')
    }
  })
})

router.get('/logout', (req,res) => {
 // console.log("api calll logout");
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin')
});


/* GET Admin listing. */

router.get('/',verifyAdminLogin, function(req, res, next) {
  let adminName = req.session.admin
  productHelper.getAllProducts().then((products) =>{
   // console.log(products)
    res.render('admin/view-products', {products,adminName,admin :true})
  })
});


router.get('/add-products',verifyAdminLogin, function(req,res){
  let adminName = req.session.admin
  res.render('admin/add-products', {admin :true,adminName})
});

router.post('/add-products', function(req,res){
  //console.log(req.body);
  //console.log(req.files.image);
  productHelper.addProduct(req.body, (id)=>{
    let image =req.files.image
   //console.log(id)
    image.mv('./public/product-images/'+id+'.jpg', (err)=>{
      if(!err){
        res.render('admin/add-products', {admin :true})
      }else{
       console.log(err);
      }
    })
   // console.log('data added successfully')
  })
  
});

router.get('/delete-products/:id', function(req,res){
  //let proID = req.query.id
  //console.log(proId.name);
  let proId = req.params.id
  productHelper.deleteProduct(proId).then((response)=>{
    const path ='./public/product-images/'+proId+'.jpg'
    try {
      fs.unlinkSync(path)
     // console.log('deleted');
    } catch (err) {
     // console.error(err);
    }
    res.redirect('/admin/')
  })
});


router.get('/edit-product/:id', async function(req,res){
  let adminName = req.session.admin
  let proId = req.params.id
  let editProduct = await productHelper.getProductDetails(proId)
 //console.log(editProduct); 
  res.render('admin/edit-product', {admin :true,editProduct,adminName})
});


router.post('/edit-product/:id', (req,res)=>{
  let proId = req.params.id
  let updatedData =req.body
  productHelper.updateProduct(proId,updatedData).then(()=>{
    //console.log("update successfully");
    if(req.files && req.files.image){    
      let image = req.files.image
      image.mv('./public/product-images/'+proId+'.jpg', (err) => {
        if(err){
          console.log(err);
        }else{
          console.log('new data added successfully')  
          res.redirect('/admin/')       
        }
      })     
    }else{
      console.log("failed try again"); 
      res.redirect('/admin/')
    }
  })
})

router.get("/orders",verifyAdminLogin, async(req, res) => {
  let adminName = req.session.admin
  let orders = await adminHelper.getAllOrders()
  //console.log(orders);
  res.render('admin/order-view-admin',{adminName,orders,admin : true})
});

router.get("/update-order/:id",async(req, res) => {
  let adminName = req.session.admin
  let orderId = req.params.id
  let order = await adminHelper.getOrderDetails(orderId)
  //console.log(orders);
  res.render('admin/update-order',{adminName,order,admin : true})
});

module.exports = router;
