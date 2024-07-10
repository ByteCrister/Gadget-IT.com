const db = require('../models/DB');

module.exports = {
    getProductsModel : (callback)=>{
        db.query(`select * from category`, callback);
    }
}