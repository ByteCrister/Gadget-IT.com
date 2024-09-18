const db = require('../config/DB');
module.exports = {
    getProductionModel: (table, callback) => {
        const query = `
        select
        p.product_id as id,
        p.product_name as name,
        p.main_category as type,
        p_s.incoming as incoming,
        p_s.reserved as reserved,
        p_s.quantity as quantity,
        p_s.price as price,
        p_s.cut_price as cut_price,
        v.vendor_name as vendor

        FROM ${table} as p
        JOIN product_stock as p_s 
        ON p.product_id = p_s.product_id
        JOIN vendors as v
        ON v.vendor_no = p.vendor_no
`
        db.query(query, callback);
    },
    getDescriptions: (callback) => {
        db.query(`select * from description;`, callback);
    },
    getExtraImages: (callback) => {
        db.query(`select * from extra_images;`, callback);
    },
    getFullRows: (table, callback) => {
        db.query(`select * from ${table};`, callback);
    },
    getTableColumns: (table, callback) => {
        db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'gadget_it' 
            AND TABLE_NAME = '${table}';`,
            callback
        );
    },
    getVendors: (callback) => {
        db.query(`select * from vendors;`, callback);
    },
    updateStockValues: (id, MainTableEndIndex, callback) => {
        const sql = `
        UPDATE product_stock SET
        incoming = ?,
        reserved = ?,
        quantity = ?,
        cut_price = ?,
        price = ?
        WHERE product_id = ?`;

        const values = [
            MainTableEndIndex[0].value, // incoming
            MainTableEndIndex[1].value, // reserved
            MainTableEndIndex[2].value, // quantity
            MainTableEndIndex[3].value, // cut_price
            MainTableEndIndex[4].value, // price
            id
        ];
        db.query(sql, values, callback);
    },
    updateProductMainTable: (id, table, MainTableEndIndex, callback) => {
        let sql = `update ${table} set `;
        for (i = 6; i < MainTableEndIndex.length; i++) {
            if (MainTableEndIndex.length - 1 === i) {
                sql += `${MainTableEndIndex[i].column}='${MainTableEndIndex[i].value}' `
            } else {
                sql += `${MainTableEndIndex[i].column}='${MainTableEndIndex[i].value}', `
            }
        }

        sql += ` where product_id=${id};`

        db.query(sql, callback);
    },
    updateProductOldDescription: (value, no, callback) => {
        let sql = `update description set head_value = ? where description_no = ?`;

        db.query(sql, [value, no], callback);
    },
    addNewDescription: (id, category, newAddedDes, callback) => {
        let sql = `insert into description (product_id, product_main_category, head, head_value) values `;
        for (i = 0; i < newAddedDes.length; i++) {
            if (newAddedDes.length - 1 === i) {
                sql += ` (${id}, '${category}', '${newAddedDes[i].column}', '${newAddedDes[i].value}'); `
            } else {
                sql += ` (${id}, '${category}', '${newAddedDes[i].column}', '${newAddedDes[i].value}'), `
            }
        }

        db.query(sql, callback);

    },
    addNewImages: (id, category, newAddedImg, callback) => {
        let sql = `insert into extra_images (product_id, category, image) values `;
        newAddedImg.map((item, i) => {
            if (newAddedImg.length - 1 === i) {
                sql += ` (${id}, '${category}',  '${item.value}'); `
            } else {
                sql += ` (${id}, '${category}', '${item.value}'), `
            }
        });

        db.query(sql, callback);
    },
    deleteImages: (newAddedImg, callback) => {
        const imgNo = newAddedImg.join(', ');
        const query = `delete from extra_images where image_no in (${imgNo})`;
        db.query(query, callback);
    },
    deleteDescriptions: (DeletedDes, callback) => {
        const desNo = DeletedDes.join(', ');
        const query = `delete from description where description_no in (${desNo})`;
        db.query(query, callback);
    },
    updateOldExtraImg: (value, imgNo, callback) => {
        db.query(`update extra_images set image = ? where image_no = ? ;`, [value, imgNo], callback);
    }
}