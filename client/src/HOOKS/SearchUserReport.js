export const SearchUserReport = (searchedItem, Store, setReportData) => {
    searchedItem = isNaN(searchedItem) ? String(searchedItem).toLowerCase() : String(searchedItem);
    setReportData(prev => ({
        ...prev,
        MainData: Store.map((item) => ({ ...item, point: 0 }))
    }));
    Store.forEach((item) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'point' && key !== 'user_report_no') {
                if (key === 'report_date') {
                    totalPoint += new Date(value).toLocaleString().includes(searchedItem.toLowerCase()) ? 1 : 0;
                    totalPoint += new Date(value).toLocaleString() === String(searchedItem.toLowerCase()) ? 10 : 0;
                } else {
                    totalPoint += String(value).toLowerCase().includes(searchedItem) ? 1 : 0;
                    totalPoint += String(value).toLowerCase() === searchedItem ? 10 : 0;
                }
            }
        });
        setReportData(prev => ({
            ...prev,
            MainData: prev.MainData.map((item_) => item_.user_report_no === item.user_report_no ? { ...item_, point: totalPoint } : item_)
        }));
    });
    setReportData(prev => ({
        ...prev,
        MainData: prev.MainData.sort((a, b) => b.point - a.point).filter((item) => {
            return String(item.user_id).includes(String(searchedItem)) ||
                String(item.report_string).toLowerCase().includes(String(searchedItem).toLowerCase()) ||
                String(item.report_description).toLowerCase().includes(String(searchedItem).toLowerCase()) ||
                String(new Date(item.report_description).toLocaleString()).includes(searchedItem)
        })
    }));
};