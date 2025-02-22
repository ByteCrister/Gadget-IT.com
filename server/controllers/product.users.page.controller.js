const performQuery = require("../config/performQuery");
const productUsersPageModel = require("../models/product.users.page.model");

const getUserData = async (user) => {
    try {
        const [user_questions, user_ratings, user_reports, user_orders] = await Promise.all([
            performQuery(productUsersPageModel.getUserQuestionQuery, user.user_id),
            performQuery(productUsersPageModel.getUserRatingQuery, user.user_id),
            performQuery(productUsersPageModel.getUserReportQuery, user.user_id),
            performQuery(productUsersPageModel.getUserOrdersQuery, user.user_id)
        ]);

        return {
            user,
            user_questions,
            user_ratings,
            user_reports,
            user_orders
        };
    } catch (error) {
        console.error(`Error fetching data for user ${user.user_id}:`, error);
        throw error; // Rethrow to propagate error to the main function
    }
};

module.exports = {
    getUsersPageData: async (req, res) => {
        try {
            const Users = await performQuery(productUsersPageModel.getUsersQuery);

            // Fetch all user data in parallel
            const UsersDocument = await Promise.all(Users.map(getUserData));

            const period = await performQuery(productUsersPageModel.getPeriodQuery);

            res.status(200).send({ UsersDocument, period }); 
        } catch (error) {
            console.error('Error in getUsersPageData:', error);
            res.status(500).send({ message: 'Failed to fetch user data', error: error.message });
        }
    }
};
