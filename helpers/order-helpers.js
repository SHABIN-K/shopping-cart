var db=require('../Config/connection')
var collection=require('../Config/collections')
var objectId=require('mongodb').ObjectID

module.exports = {
    getUserOrders : (userID) => {
        //console.log(userID);
        return new Promise(async(resolve,reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({user:objectId(userID)}).toArray()
            resolve(orders)
        })
    },
    getOrderProducts : (orderID) => {
        //console.log(orderID);
        return new Promise(async(resolve,reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderID)}
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
                }
            ]).toArray()
           // console.log(orderItems);
            resolve(orderItems)
        })
    }
}
