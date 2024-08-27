export const GetMainTable =(table, MainTables, SubTables) => {
    const mainTableExists = MainTables.some((item) => item.category_name === table);
    if (mainTableExists) {
        return table;
    } else {
        const subTable = SubTables.filter((item) => item.sub_category_name === table);
        if (subTable.length > 0) {
            return GetMainTable(subTable[0].main_category_name, MainTables, SubTables);
        } else {
            return null;
        }
    }
};