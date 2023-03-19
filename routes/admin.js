var express = require('express');
var router = express.Router();
var fs = require('fs')

var productHelper = require('../helpers/product-helpers')
var adminHelper = require('../helpers/admin-helper')

const verifyAdminLogin = (req, res, next) => {
  console.log(req.session.admin.LoggedIn);
  if (req.session.admin.LoggedIn) {
    console.log(req.session.admin.LoggedIn);
    next();
  } else {
    console.log("user not login in");
    res.redirect('admin/adminlogin');
  }
}

/* GET Login page. */
router.get('/adminlogin', (req,res) => {
  if(req.session.admin){
    res.redirect('/admin/')
  }else{
    console.log("admn login faildeee");
    res.render('admin/login',{admin : true ,"loginError": req.session.adminloginError})
    req.session.adminloginError=false
  }
});

router.post('/adminlogin', (req,res)=>{
  console.log(req.body);
  adminHelper.AdminLogin(req.body).then((response)=>{
    if(response.status){
      console.log(response.status);
      req.session.admin=response.admin
      req.session.admin.LoggedIn=true
      res.redirect('/admin/')
    }else{
      req.session.adminloginError="invalid email or password"
      res.redirect('admin/adminlogin')
    }
  })
})

/* GET Admin listing. */

router.get('/',verifyAdminLogin, function(req, res, next) {
  let admin = req.session.admin
  productHelper.getAllProducts().then((products) =>{
   // console.log(products)
    res.render('admin/view-products', {products,admin,admin :true})
  })
});

router.get('/add-products', function(req,res){
  res.render('admin/add-products', {admin :true})
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
  let proId = req.params.id
  let editProduct = await productHelper.getProductDetails(proId)
 //console.log(editProduct); 
  res.render('admin/edit-product', {admin :true,editProduct})
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

module.exports = router;
