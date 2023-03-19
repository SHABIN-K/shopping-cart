var db= require('../Config/connection')
var collection= require('../Config/collections')
var objectId=require('mongodb').ObjectID

module.exports = {
    getTotalAmount : (userID) => {
        return new Promise(async(resolve,reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userID)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup :{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {  
                    $project: {
                        item:1,
                        quantity:1,
                        product: { $arrayElemAt: [ '$product', 0] }
                    }
                },
                {
                    $group: {
                        _id:null,
                        total:{
                            $sum:{
                                $multiply: [
                                    { $toInt: "$quantity" },
                                    { $toDouble: "$product.Price" }
                                  ]
                            }
                        }
                    }
                }
            ]).toArray()
            //console.log(total);
            resolve(total[0].total)
        })
    },
    placeOrder : (orderDetails,products,totalAmount) => {
        return new Promise((resolve,reject) => {
           //console.log("order : " + JSON.stringify(orderDetails) +"\n products :"+ JSON.stringify(products) + "\n Amount :"+ JSON.stringify(totalAmount));
           let status = orderDetails['payment-method'] === 'COD'?'placed':'pending'

           let orderObj ={
            user:objectId(orderDetails.userId),
            products:products,
            amount:totalAmount,
            deliveryDetails:{
                mobile:orderDetails.mobile,
                address:orderDetails.address,
                pincode:orderDetails.pincode
            },
            date:new Date(),
            paymentMethod:orderDetails['payment-method'],
            status:status
           }

           db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
             db.get().collection(collection.CART_COLLECTION).removeOne({user:objectId(orderDetails.userId)})
              resolve(response.ops[0]._id)
           })
        })
    },
    getCartProductList : (userID) => {
        return new Promise(async(resolve,reject) => {
            let cart =await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userID)})
            //console.log(cart);
            resolve(cart.products)
        })
    }
}
