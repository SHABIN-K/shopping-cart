var db= require('../Config/connection')
var collection= require('../Config/collections')
var objectId=require('mongodb').ObjectID

const bcrypt = require('bcrypt');


module.exports = {
    adminLogin: (adminData) => {
        console.log(adminData);
        return new Promise(async (resolve, reject) => {
            let response = {}            
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        //console.log("Login success");
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        //console.log("Login failed");
                        resolve({ status: false })
                    }
                })
            } else {
                //console.log("Admin not found");
                resolve({ status: false })
            }
        })
    },
    getAllOrders : () => {
        return new Promise(async(resolve ,reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders)
        })
    },
    getOrderDetails : (orderID) =>{
        return new Promise((resolve,reject) =>{
            let orderDetails = db.get().collection(collection.ORDER_COLLECTION).findOne({_id : objectId(orderID)})
            resolve(orderDetails)
        })
    }
}