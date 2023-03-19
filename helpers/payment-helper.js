var db=require('../Config/connection')
var collection=require('../Config/collections')
var objectId=require('mongodb').ObjectID

const Razorpay = require('razorpay');

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
                   // console.log(err);
                    reject();
                }else{
                console.log("New order",order);
                resolve(order)
                }
            })
        })
    },
    verifyPayment : (orderDetails) => {
        return new Promise((resolve,reject) =>{
            const { createHmac } = require('node:crypto');
            let hmac = createHmac('sha256', collection.YOUR_KEY_SECRET);

            hmac.update(orderDetails['payment[razorpay_order_id]']+'|'+orderDetails['payment[razorpay_payment_id]']);
            generated_signature = hmac.digest('hex');

           //console.log("generated sign",generated_signature);
           //console.log("sign",orderDetails['payment[razorpay_signature]']);

            if (generated_signature == orderDetails['payment[razorpay_signature]']) {
               resolve()
            }else {
               reject()
            }
        })
    },
    changePaymentStatus : (orderID) => {
        return new Promise(async(resolve,reject) => {
            await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderID)},
            {
                $set : {
                    status: 'paid'
                }
            }).then(()=>{
                resolve()
            }).catch((err)=>{
                reject()
            })
        })
    }
}

//    'payment[razorpay_payment_id]': 'pay_LTGMoX6SgvbOdl',
//    'payment[razorpay_order_id]': 'order_LTGMFvEN8Fm2qh',
//    'payment[razorpay_signature]': '0d92cbad08e6ceb67ceddc22774a9ef64d82dcfc5c089bb09335f6e3fa3ecece',
//    'order[id]': 'order_LTGMFvEN8Fm2qh',
//    'order[entity]': 'order',
//    'order[amount]': '28000',
//    'order[amount_paid]': '0',
//    'order[amount_due]': '28000',
//    'order[currency]': 'INR',
//    'order[receipt]': '6416998225d4534954170e3c',
//    'order[offer_id]': '',
//    'order[status]': 'created',
//    'order[attempts]': '0',
//    'order[created_at]': '1679202690'
