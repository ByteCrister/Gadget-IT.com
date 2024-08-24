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
        let questionMarks = `?, ?, ?, ?, ?, ?`;
        let columnNames = `product_id, brand, main_category, product_name, image, vendor_no`;
        let arrValues = [];
        arrValues.push(newProductID);
        arrValues.push(mandatoryValues.brand);
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

        // console.log(query);
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

        // console.log(query);
        db.query(query, callback);
    },

    createNewDescriptionColumn: (productID, tableName, Description, callback) => {
        let values = '';
        let query = `
        INSERT INTO description (product_id, product_main_category, head, head_value)
        VALUES 
        `;
        
        // Helper function to escape single quotes
        function escapeString(str) {
            return str.replace(/'/g, "''");
        }
    
        Description.forEach((items, index) => {
            const escapedHead = escapeString(items.head);
            const escapedValue = escapeString(items.value);
            if (index === Description.length - 1) {
                values += `(${productID}, '${tableName}', '${escapedHead}', '${escapedValue}');`;
            } else {
                values += `(${productID}, '${tableName}', '${escapedHead}', '${escapedValue}'), `;
            }
        });
    
        query += values;
    
    
        db.query(query, callback);
    },    

    insertExtraImages: (category, productID, images, callback) => {
        let query = `INSERT INTO extra_images (product_id, category, image) VALUES `;
        const values = [];
        images.forEach((item, index) => {
            query += `(?, ?, ?)`;
            if (index !== images.length - 1) {
                query += `, `;
            }
            values.push(productID, category, `data:${item.mimeType};base64,${item.base64}`);
        });

        db.query(query, values, callback);
    }


};
