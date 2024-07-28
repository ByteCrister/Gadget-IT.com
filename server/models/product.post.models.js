const db = require("../models/DB");

module.exports = {
    updateProductIDModel: (callback) => {
        db.query(
            `
            UPDATE static_values SET product_id = 1 + (
                SELECT product_id FROM static_values WHERE value_no = 0
            ) WHERE value_no = 0;
            `,
            callback
        );
    },

    getProductIDModel: (callback) => {
        db.query(
            `
            SELECT product_id FROM static_values WHERE value_no = 0;
            `,
            callback
        );
    },

    PostStockValues: (mandatoryValues, newProductID, callback) => {
        db.query(
            `
            INSERT INTO product_stock(product_id, incoming, reserved, quantity, cut_price, price)
            VALUES(?, ?, ?, ?, ?, ?);
            `,
            [
                newProductID,
                mandatoryValues.incoming,
                mandatoryValues.reserved,
                mandatoryValues.quantity,
                mandatoryValues.cut_price,
                mandatoryValues.price,
            ],
            callback
        );
    },

    newProductPostModel: (table, newKeyValue, tableColumnValue, mandatoryValues, newProductID, callback) => {
        let open = " (";
        let close = ")";
        let questionMarks = `?, ?, ?, ?, ?`;
        let columnNames = `product_id, main_category, product_name, image, vendor_no`;
        let arrValues = [];
        arrValues.push(newProductID);
        arrValues.push(mandatoryValues.mainCategory);
        arrValues.push(mandatoryValues.product_name);
        arrValues.push(`data:${mandatoryValues.image.mimeType};base64,${mandatoryValues.image.base64}`);
        arrValues.push(mandatoryValues.vendor);

        if (tableColumnValue.length === 0) {
            newKeyValue.forEach((item) => {
                arrValues.push(item.value);
                questionMarks += `, ?`;
                columnNames += `, ${item.key}`;
            });
        } else {
            tableColumnValue.forEach((item) => {
                arrValues.push(item.value);
                questionMarks += `, ?`;
                columnNames += `, ${item.key}`;
            });
            newKeyValue.forEach((item) => {
                arrValues.push(item.value);
                questionMarks += `, ?`;
                columnNames += `, ${item.key}`;
            });
        }

        const query = `
            INSERT INTO ${table} ${open} ${columnNames} ${close}
            VALUES ${open} ${questionMarks} ${close};
        `;

        console.log(query);
        db.query(query, arrValues, callback);
    },


    createNewColumn: (table, newKeyValue, callback) => {
        let query = `
        ALTER TABLE ${table}
        `;
        newKeyValue.map((items, index) => {
            if (index === newKeyValue.length - 1) {
                query += ` ADD COLUMN ${items.key} varchar(100)`;
            } else {
                query += ` ADD COLUMN ${items.key} varchar(100),`;
            }
        });

        console.log(query);
        db.query(query, callback);
    },
};
