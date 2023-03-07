var db=require('../Config/connection')
var collection=require('../Config/collections')
var objectId=require('mongodb').ObjectID

module.exports = {
    addToCart : (proID,userID) => {
        return new Promise (async(resolve,reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user :objectId(userID)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userID)},
                {
                  $push:{
                      products:objectId(proID)
                  }
                }).then((response) => {
                    resolve()
                })
            }else{
                let cartObj = {
                    user :objectId(userID),
                    products : [objectId(proID)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts : (userID) => {
        return new Promise(async(resolve,reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userID)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{proList:'$products'},
                        pipeline:[
                            {
                               $match:{
                                $expr:{
                                    $in:['$_id',"$$proList"]
                                }
                               }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}