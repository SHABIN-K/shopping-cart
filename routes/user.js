var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products = [{
    name: 'iphone 11',
    category:'Mobile',
    description:'The iPhone 13 has a 6.1-inch (15 cm) IPS LCD with a resolution is 1792 × 828 pixels',
    imgURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi19me2QrJE5Q7-Pg-xv2gaYciIgQdm3mmnQ&usqp=CAU'
  },{
    name: 'iphone 12',
    category:'Mobile',
    description:'The iPhone 13 has a 6.1-inch (15 cm) IPS LCD with a resolution is 1792 × 828 pixels',
    imgURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYPxYoLD44K_DXjhxWFGEflEReeSFjq_rpnw&usqp=CAU'
  },{
    name: 'iphone 13',
    category:'Mobile',
    description:'The iPhone 13 has a 6.1-inch (15 cm) IPS LCD with a resolution is 1792 × 828 pixels',
    imgURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFk_WTMf3kw2fE1lL2IOgM_aMtGzEKTt2beg&usqp=CAU'
  },{
    name: 'iphone 14',
    category:'Mobile',
    description:'The iPhone 14 has aixel density  a maximum',
    imgURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSL-LteDa-EtlptRoNCByPz2lDDl_x3dyuXw&usqp=CAU'
  }]
  res.render('index', { products, admin:false })

});

module.exports = router;
