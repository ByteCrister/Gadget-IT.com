const db = require('../config/DB');

module.exports = {
    // *used in user crud controller
    insertNewOrderQuery: (product, insertId, callback) => {
        db.query(`
            insert into user_order_products
            (order_id, product_id, quantity) 
            values (? ,? ,? ) ;`,
            [insertId, product.product_id, product.quantity],
            callback);
    },
    // *used in user crud controller
    insertNewOrderProductQuery: (order, callback) => {
        db.query(`
            insert into user_order 
            (user_id, name, email, phone_number, full_address, order_status, order_type)
            values (?, ?, ?, ?, ?, ?, ?)`,
            [order.user_id, order.full_name, order.email, order.phone_number, order.address, 'Order is Processing', order.payMethodState],
            callback);
    },
    // *used in user crud controller
    getOrderInfoByIdQuery: (insertedId, callback) => {
        db.query('select * from user_order where order_id = ? ;', [insertedId], callback);
    },
    // *used in user crud controller
    getOrderProductByIdQuery: (insertedId, callback) => {
        db.query('select * from user_order_products where order_id = ? ;', [insertedId], callback);
    },
}