import { GetCategoryName } from "./GetCategoryName";


export const SearchQuestions = (searchValue, SearchQuestion, setQuestions) => {
    setQuestions(SearchQuestion.map((item) => ({ ...item, point: 0 })));
    SearchQuestion.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'question_no') {
                if (key === 'question_date') {
                    totalPoint += String(new Date(value).toLocaleString()).toLowerCase().includes(String(searchValue).toLowerCase()) ? 1 : 0;
                    totalPoint += String(new Date(value).toLocaleString()).toLowerCase() === String(searchValue).toLowerCase() ? 10 : 0;
                }
                totalPoint += String(value).toLowerCase().includes(String(searchValue).toLowerCase()) ? 1 : 0;
                totalPoint += String(value).toLowerCase() === String(searchValue).toLowerCase() ? 10 : 0;

            }
        });

        setQuestions((prev) => prev.map((item_, index_) => index === index_ ? { ...item_, point: totalPoint } : item_));
    });

    setQuestions((prev) => prev.sort((a, b) => b.point - a.point));

    setQuestions((prev) => prev.filter(item =>
        String(item.product_id).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.user_id).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(GetCategoryName(item.main_category)).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.first_name + item.last_name).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.email).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(new Date(item.question_date).toLocaleString()).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.question).toLowerCase().includes(searchValue.toLowerCase())

    ));
};
