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
               // console.log("New order",order);
                resolve(order)
                }
            })
        })
    }
}


// 'payment[razorpay_payment_id]': 'pay_LT4id2DVckeCVA',
// 'payment[razorpay_order_id]': 'order_LT4fKiGz9hGrqM',
// 'payment[razorpay_signature]': '0ee9bff2e7d7575b390e288b571a19d7dbc01169b04f80c96cdb9fd1dece09f5',
// 'order[id]': 'order_LT4fKiGz9hGrqM',
// 'order[entity]': 'order',
// 'order[amount]': '28000',