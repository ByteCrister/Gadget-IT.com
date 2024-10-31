const db = require('../config/DB');

module.exports = {
    getTableNames: (callback) => {
        db.query('select category_name from category', callback);
    },
    getTableValues: (table, callback) => {
        db.query(`
            SELECT 
            p.product_name AS p_name,
            p.product_id AS id,
            p.main_category AS category,
            p.hide AS hide,
            p_s.incoming,
            p_s.reserved,
            p_s.quantity,
            p_s.price
            FROM ${table} AS p 
            JOIN product_stock AS p_s
            ON p.product_id = p_s.product_id;
        `, callback);
    },
    getMainTables: (callback)=>{
        db.query(`select category_name from category`, callback);
    },
    getSubTables: (callback)=>{
        db.query(`select * from sub_category`, callback);
    },
    updateHide : (id, table, hide, callback)=>{
        db.query(`update ${table} set hide = ?  where product_id = ? ;`, [hide, id], callback);
    },
    deleteProductsFromMainTable : (id, table, callback)=>{
        db.query(`delete from ${table} where product_id = ?;`, [id], callback);
    },
    deleteProductsFromDescriptionTable : (id,callback)=>{
        db.query(`delete from description where product_id = ?;`, [id], callback);
    },
    deleteProductsFromExtraImageTable : (id,callback)=>{
        db.query(`delete from extra_images where product_id = ?;`, [id], callback);
    },
    deleteProductsStockFromTable : (id, callback)=>{
        db.query(`delete from product_stock where product_id = ?;`, [id], callback);
    },
    deleteHomeProductQuery: (id, callback)=>{
        db.query('delete from home_product_select where product_id = ? ;', [id], callback);
    }
}
