var db= require('../Config/connection')
var collection= require('../Config/collections')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                reject("User already exists")
            } else {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    resolve(data.ops[0])
                })
            }
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}            
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("Login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Login failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("user not found");
                resolve({ status: false })
            }
        })
    }
}


