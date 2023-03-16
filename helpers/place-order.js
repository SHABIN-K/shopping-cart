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
    }
}
