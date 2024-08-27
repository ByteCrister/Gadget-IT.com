const db = require("./DB");

module.exports = {
    CreateNewCategoryModel: (categoryName, callback) => {
        db.query(
            `create table ${categoryName}
            (
                product_id int,
                hide int(1) not null,
                brand varchar(100),
                main_category varchar(100),
                product_name varchar(100),
                image mediumtext,
                vendor_no int,

                primary key(product_id)
            )`,
            callback
        );
    },

    insertNewMainCategoryModel: (categoryName, callback) => {
        db.query(
            `insert into category(category_name)
            values(?)`,
            [categoryName],
            callback
        );
    },

    insertNewSubCategoryModel: (main, sub, callback) => {
        db.query(
            `insert into sub_category (sub_category_name, main_category_name)
            values(?, ?)`,
            [sub, main],
            callback
        );
    },

    deleteMainCategoryTable: (table, callback) => {
        console.log("Delete table called....");
        db.query(`drop table ${table} ;`, callback);
    },

    deleteMainCategoryName: (categoryName, callback) => {
        db.query(
            `delete from category where category_name = ? ;`,
            [categoryName],
            callback
        );
    },

    deleteDescription: (table, callback) => {
        db.query(
            `delete from description where product_main_category = ? ;`,
            [table],
            callback
        );
    },

    searchForSubCategory: (mainCategory, callback) => {
        db.query(
            `select sub_category_name from sub_category where main_category_name = ? ;`,
            [mainCategory],
            callback
        );
    },

    deleteSubCategory: (category, callback) => {
        db.query(
            `delete from sub_category where main_category_name = ?`,
            [category],
            callback
        );
    },

    deleteSortingOptions: (category, callback) => {
        db.query(
            `delete from sorting where category = ? ;`
            , [category]
            , callback
        );
    },

    renameMainCategoryTable: (oldName, newName, callback) => {
        db.query(`alter table ?? rename to ?? ;`, [oldName, newName], callback);
    },
    renameMainCategoryNameTable: (oldName, newName, callback) => {
        db.query(
            `update category set category_name = ? where category_name = ?`,
            [newName, oldName],
            callback
        );
    },
    renameSubCategoryOfMainName: (oldName, newName, callback) => {
        db.query(
            `update sub_category set main_category_name = ? where main_category_name = ?`,
            [newName, oldName],
            callback
        );
    },
    renameSubCategoryOfSubName: (oldName, newName, callback) => {
        db.query(
            `update sub_category set sub_category_name = ? where sub_category_name = ?`,
            [newName, oldName],
            callback
        );
    },
    renameSubCategoryOnDescription: (oldName, newName, callback) => {
        db.query(
            `update description set product_main_category = ? where product_main_category = ?`,
            [newName, oldName],
            callback
        );
    },
    renameCategoryOfSorting: (oldName, newName, callback) => {
        db.query(
            `update sorting set category = ? where category = ?`,
            [newName, oldName],
            callback
        );
    },
    renameCategoryOfKeyFeature: (oldName, newName, callback) => {
        db.query(
            `update key_feature set category = ? where category = ?`,
            [newName, oldName],
            callback
        );
    },

    addNewColumnModel: (table, newColumn, insertAfter, callback) => {
        const sql = `ALTER TABLE ?? ADD ?? varchar(255) AFTER ??`;
        db.query(sql, [table, newColumn, insertAfter], callback);
    },

    deleteColumnModel: (table, column, callback) => {
        const sql = `ALTER TABLE ?? DROP COLUMN ??`;
        db.query(sql, [table, column], callback);
    },

    renameColumnModel: (table, oldName, newName, callback) => {
        const sql = `ALTER TABLE ?? CHANGE ?? ?? varchar(255)`;
        db.query(sql, [table, oldName, newName], callback);
    },

    insertNewSortingModel: (item, callback) => {
        db.query(`
        insert into sorting (category, sorting_column, sort_by_names)
        values (?, ?, ?)`,
            [item.category, item.sorting_column, item.sort_by_names],
            callback);
    },

    // deleteSortingOptionModel: (sorting_no, callback) => {
    //     db.query(`delete from sorting where sorting_no = ?`, [sorting_no], callback);
    // },

    deleteSortingOptionOfCategory: (category, callback) => {
        db.query(`delete from sorting where category = ?`, [category], callback);
    },

    insertNewKeyFeatureModel: (category, column, callback) => {
        db.query(`insert into key_feature (category, key_feature_column) values (?, ?);`, [category, column], callback);
    },

    deleteKeyFeatureModel: (category, column, callback) => {
        db.query(`delete from key_feature where category = ? and key_feature_column = ?`, [category, column], callback);
    },
    deleteKeyFeaturesOption: (category, callback) => {
        db.query(`delete from key_feature where category = ? ;`, [category], callback);
    }
};
