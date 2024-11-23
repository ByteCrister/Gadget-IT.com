const performQuery = require("../config/performQuery");
const productSupportModel = require("../models/product.support.model");


module.exports = {
    getSupportData: async (req, res) => {
        try {
            const questions = await performQuery(productSupportModel.getQuestions);
            const rating = await performQuery(productSupportModel.getRatings);
            const allRating = await performQuery(productSupportModel.getAllRatings);
            const perOrders = await performQuery(productSupportModel.getPreOrders);
            res.status(200).send({ questions: questions, rating: rating, allRating: allRating, perOrders: perOrders });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    putAnswer: async (req, res) => {
        try {
            await performQuery(productSupportModel.putAnswerModel, req.body);
            await performQuery(productSupportModel.postUserNewQuestionNotificationQuery, req.body);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    deleteAnswer: async (req, res) => {
        try {
            await performQuery(productSupportModel.deleteAnswerModel, req.params.question_no);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    updateIsSend: async (req, res) => {
        try {
            await performQuery(productSupportModel.updateIsSendQuery, req.params.preorder_no);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
   postUserNewNotification: async (req, res) => {
    const { user_id, preOrders } = req.body;
    try {
        await performQuery(productSupportModel.postUserNewPreOrderNotification, { ...preOrders, user_id: user_id });
        res.status(201).send({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

};