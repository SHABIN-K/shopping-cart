var db= require('../Config/connection')
var collection= require('../Config/collections')
var objectId=require('mongodb').ObjectID

module.exports={
    addProduct:(product, callback)=>{
        let Price = parseInt(product.Price)
     // console.log(product);
        db.get().collection('product').insertOne(
            {
                name:product.name,
                category:product.category,
                Price:Price,
                description:product.description 
            }
        ).then((data) => {
           callback(data.ops[0]._id)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
            
    },
    deleteProduct : (proId)=>{
        return new Promise((resolve,reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=> {
               //console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails : (proId) =>{
        return new Promise((resolve,reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=> {
                resolve(product)
            })
        })
    },
    updateProduct : (proId,updatedData) =>{
        let Price = parseInt(updatedData.Price)
        console.log(updatedData.Price);
        console.log(Price);
        return new Promise((resolve,reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},
            {
                $set:
                {
                    name:updatedData.name,
                    category:updatedData.category,
                    Price:Price,
                    description:updatedData.description 
                }
            }).then((response) => {
                resolve()
            })
        })
    }
}