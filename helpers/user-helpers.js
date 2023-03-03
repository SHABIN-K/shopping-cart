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
    },
    doLogin : (userData) =>{
        return new Promise(async (resolve,reject)=>{
            let LoginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
           //console.log("database data :" +user.Password);
           //console.log("Login data :" +userData.password);
            if(user){
                bcrypt.compare(userData.password, user.Password).then((status)=>{
                    if(status){
                        console.log("Login success");
                    }else{
                        console.log("Login failed");
                    }
                })
            }else{
                console.log("user not found");
            }
        })
    }
}