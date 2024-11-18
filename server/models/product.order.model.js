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


    getOrdersQuery: (callback) => {
        db.query('select * from user_order order by order_id desc; ', callback);
    },
    updateOrderStatus: (newStatus, order_id, callback) => {
        db.query('update user_order set order_status = ? where order_id = ? ;', [newStatus, order_id], callback);
    },
    updatePaymentStatusQuery: (body, callback) => {
        db.query('update user_order set payment_status = ? where order_id = ? ; ', [body.payment_status, body.order_id], callback);
    },
    deleteOrderQuery: (order_id, callback) => {
        db.query('delete from user_order where order_id = ? ;', [order_id], callback);
    },
    deleteOrderProductQuery: (order_id, callback) => {
        db.query('delete from user_order_products where order_id = ? ;', [order_id], callback);
    },
    postUserOrderNotification: (body, callback) => {
        db.query('insert into notification_user (user_id, message_token, type) values (?, ?, ?) ;',
            [body.user_id, body.order_id, body.status === 'Canceled' ? 'order-canceled' : 'order', 0],
            callback
        );
    },
    getProductName: (table, product_id, callback) => {
        db.query(`select product_name from ${table} where product_id = ?;`, [product_id], callback);
    },
    getProductPrice: (product_id, callback) => {
        db.query('select price from product_stock where product_id = ?; ', [product_id], callback);
    },
    updateInvoice: (order_id, callback) => {
        db.query('update user_order set invoice_status = ? where order_id = ?;', [1, order_id], callback);
    },
    postInvoiceNotification: (OrderInfo, callback) => {
        db.query('insert into notification_user (user_id, message_token, type) values (?, ?, ?) ;',
            [OrderInfo.user_id, OrderInfo.order_id, 'invoice-message'],
            callback
        );
    }
};