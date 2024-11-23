const performQuery = require("../config/performQuery");
const productUsersPageModel = require("../models/product.users.page.model");


module.exports = {
    getUsersPageData: async (req, res) => {
        try {
            const Users = await performQuery(productUsersPageModel.getUsersQuery);
            const UsersDocument = await Promise.all(Users.map(async (user) => {
                return {
                    user: await user,
                    user_questions: await performQuery(productUsersPageModel.getUserQuestionQuery, user.user_id),
                    user_ratings: await performQuery(productUsersPageModel.getUserRatingQuery, user.user_id),
                    user_reports: await performQuery(productUsersPageModel.getUserReportQuery, user.user_id),
                    user_orders: await performQuery(productUsersPageModel.getUserOrdersQuery, user.user_id)
                };
            }));
            const period = await performQuery(productUsersPageModel.getPeriodQuery);
            res.status(201).send({ UsersDocument: UsersDocument, period: period });
        } catch (error) {
            res.status(501).send(error);
        }
    }
}