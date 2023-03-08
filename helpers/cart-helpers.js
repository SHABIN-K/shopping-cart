var db=require('../Config/connection')
var collection=require('../Config/collections')
var objectId=require('mongodb').ObjectID

module.exports = {
    addToCart : (proID,userID) => {
        let proObj={
            item:objectId(proID),
            quantity:1
        }
        return new Promise (async(resolve,reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user :objectId(userID)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=>product.item==proID)
                //console.log(proExist);
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION).updateOne({user :objectId(userID),'products.item':objectId(proID)},{
                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })
                }else{
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userID)},
                {
                  $push:{
                      products:proObj
                  }
                }).then((response) => {
                    resolve()
                })
                }
            }else{
                let cartObj = {
                    user :objectId(userID),
                    products : [proObj]
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
                {  //https://www.mongodb.com/docs/manual/reference/operator/aggregation/arrayElemAt/
                    $project: {
                        item:1,
                        quantity:1,
                        product: { $arrayElemAt: [ '$product', 0] }
                    }
                }
               //{
               //    $lookup:{
               //        from:collection.PRODUCT_COLLECTION,
               //        let:{proList:'$products'},
               //        pipeline:[//pipline used for ulliloot nokkaan
               //            {
               //               $match:{
               //                $expr:{
               //                    $in:['$_id',"$$proList"]
               //                }
               //               }
               //            }
               //        ],
               //        as:'cartItems'
               //    }
               //}
            ]).toArray()
           // console.log(cartItems);
            resolve(cartItems)
        })
    },
    getCartCount : (userID) => {
        return new Promise(async(resolve,reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userID)})
            if(cart){
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity : (countBody) => {
        count = parseInt(countBody.count)
        console.log(countBody);

        return new Promise((resolve,reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(countBody.cart), 'products.item':objectId(countBody.product)},
            {
                $inc:{'products.$.quantity':count}
            }).then((result)=>{
               // console.log("update result:", result);
                resolve()
            })        
        })
    }
}