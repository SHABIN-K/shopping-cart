const { response } = require('express');
var express = require('express');
var router = express.Router();
var fs = require('fs')

var productHelper = require('../helpers/product-helpers')


/* GET Admin listing. */

router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products) =>{
   // console.log(products)
    res.render('admin/view-products', {products,admin :true})
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
    console.log(id)
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
      console.log('deleted');
    } catch (err) {
      console.error(err);
    }

    res.redirect('/admin/')
  })
});

//
//router.get('/edit-products', function(req,res){
//  res.render('admin/edit-products', {admin :true})
//});
//
module.exports = router;
