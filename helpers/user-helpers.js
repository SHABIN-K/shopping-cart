var db= require('../Config/connection')
var collection= require('../Config/collections')
const bcrypt = require('bcrypt')

module.exports={
    doSignup:(userData) =>{
        return new Promise(async (resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })
    }
}