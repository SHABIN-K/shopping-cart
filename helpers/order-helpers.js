var db=require('../Config/connection')
var collection=require('../Config/collections')
var objectId=require('mongodb').ObjectID

module.exports = {
    getUserOrders : (userID) => {
        console.log(userID);
        return new Promise(async(resolve,reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({user:objectId(userID)}).toArray()
            resolve(orders)
        })
    }
}