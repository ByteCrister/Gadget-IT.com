const db = require('../config/DB');

module.exports = {

    getDashboardInfoQuery: (callback) => {
        db.query('select * from static_values where value_no = 0 ; ', callback);
    },

    getChartQuery: (callback) => {
        db.query(`
                SELECT 
                DATE_FORMAT(distinct_dates.order_date, '%M') AS month_name, 
                COUNT(uo.order_date) AS order_count
                FROM (
                SELECT DISTINCT DATE(order_date) AS order_date
                FROM user_order
                ORDER BY order_date DESC
                LIMIT 12
                ) AS distinct_dates
                JOIN user_order uo ON DATE(uo.order_date) = distinct_dates.order_date
                GROUP BY month_name
                ORDER BY MAX(distinct_dates.order_date) DESC;
            `,
            callback);
    },

    getStockInformation: (callback) => {
        db.query(`
            SELECT 
            COUNT(*) AS no_of_items, 
            SUM(incoming) AS will_be_received,
            SUM(CASE WHEN quantity <= reserved THEN 1 ELSE 0 END) AS low_stock,
            SUM(CASE WHEN quantity > reserved THEN 1 ELSE 0 END) AS in_stock
            FROM product_stock;
            `,
            callback);
    },

    changeStaticValuesQuery: (column, operator, value, callback) => {
        const query = `update static_values set ${column} = ${column} ${operator} ${value} where value_no = 0; `;
        // console.log(query);
        db.query(query, callback);
    },

    setNewSalesQuery: (costState, callback) => {
        db.query(`update static_values set revenue = total_sales - ${costState.cost}, profit = total_sales - ${costState.cost} - ${costState.cost_purchase}, cost = ?, cost_purchase = ? where value_no = 0; `, [costState.cost, costState.cost_purchase], callback);
    }
};