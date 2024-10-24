const productSupportModel = require("../models/product.support.model");

const performQuery = async (queryFunction, ...params) => {
    return new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

module.exports = {
    getSupportData: async (req, res) => {
        try {
            const questions = await performQuery(productSupportModel.getQuestions);
            const rating = await performQuery(productSupportModel.getRatings);
            const allRating = await performQuery(productSupportModel.getAllRatings);
            res.status(200).send({ questions: questions, rating: rating, allRating: allRating });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    putAnswer: async (req, res) => {
        try {
            await performQuery(productSupportModel.putAnswerModel, req.body);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    deleteAnswer: async (req, res) => {
        try {
            await performQuery(productSupportModel.deleteAnswerModel, req.params.question_no);

        } catch (error) {
            res.status(500).send(error);
        }
    }
};