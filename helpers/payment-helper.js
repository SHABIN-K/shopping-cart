const Razorpay = require('razorpay');
var collection=require('../Config/collections')

var instance = new Razorpay({
    key_id: collection.YOUR_KEY_ID,
    key_secret: collection.YOUR_KEY_SECRET
  });

module.exports = {
    generateRazorpay : (orderID,totalAmount) => {
        return new Promise((resolve,reject) => {
            var orderData = {
                amount: totalAmount,
                currency: "INR",
                receipt: ""+orderID,
              }
            instance.orders.create(orderData, (err, order) => {
                if(err){
                    console.log(err);
                }else{
                console.log("New order",order);
                resolve(order)
                }
            })
        })
    }
}