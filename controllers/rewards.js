import mongoose from "mongoose";
import Questions from "../models/questions.js";
import Users from "../models/auth.js";


export const countNoOfQuestionsByUser = async (req, res) => {

    try {

        const { userId} = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).send('User Not Found ')
        }

        const userQuestionCount = await Questions.countDocuments({ userId })

        // for every 5 questions,get 50 points 

        if ( userQuestionCount % 5 === 0) {
            console.log(`You have earned 50 points for posting ${userQuestionCount} questions`);
            const updatedUser = await Users.findByIdAndUpdate(
                { _id: userId },
                {
                    NoOfQuestionsPosted: userQuestionCount,
                    $inc: { EarnedPoints: 50 }
                },
                { new: true })

            res.status(200).json({
                message: 'Congratulations..You have earned 50 points',
                userQuestionCount: updatedUser.NoOfQuestionsPosted,
                earnedPoints: updatedUser.EarnedPoints,
                updatedUser
            })
        }
        else {
            const updatedUser = await Users.findByIdAndUpdate(
                { _id: userId },
                {
                    NoOfQuestionsPosted: userQuestionCount,
                    $inc: { EarnedPoints: 0 }
                },
                { new: true })

            res.status(200).json({
                userQuestionCount: updatedUser.NoOfQuestionsPosted,
                earnedPoints: updatedUser.EarnedPoints,
                updatedUser
            })
        }
        /*******update the Users Model  *****/


    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/******* If the user posts more than 5 answers,=>gold badge  */

export const countNoOfAnswersByUser = async (req, res) => {
    try {

        const { userId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).send('User Not Found')
        }


        const userAnsCount = await Questions.countDocuments({ answer: { $elemMatch: { userId } } })

        // for every 5 answers,get 100 points &  gold badge 

        if (userAnsCount % 5 === 0) {
            console.log('You have earned 100 points and an additional gold badge');
            const updatedUser = await Users.findByIdAndUpdate(
                { _id: userId },
                {
                    NoOfAnswersPosted: userAnsCount,
                    $inc: { EarnedPoints: 100, GoldBadge: 1 }
                },
                { new: true })
            res.status(200).json({
                message: 'Congratulations..You have earned  a gold badge and 100 points',
                userAnsCount: updatedUser.NoOfAnswersPosted,
                goldBadge: updatedUser.GoldBadge,
                earnedPoints: updatedUser.EarnedPoints,
                updatedUser

            })

        }
        else {
            const updatedUser = await Users.findByIdAndUpdate(
                { _id: userId },
                {
                    NoOfAnswersPosted: userAnsCount,
                    $inc: { EarnedPoints: 0, GoldBadge: 0 }
                },

                { new: true })
            res.status(200).json({
                userAnsCount: updatedUser.NoOfAnswersPosted,
                goldBadge: updatedUser.GoldBadge,
                earnedPoints: updatedUser.EarnedPoints,
                updatedUser

            })
        }



    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/*******  Count UpVotes of User's Question   ********/

export const countUpVotes = async (req, res) => {

    try {
        const { id: _id } = req.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(404).send('Question Unavailable')
        }

        const question = await Questions.findById(_id)  // get the particular question and assign to'qusetion' variable
        const postedUserId = question.userId;

        // for every 5 votes,get 50 points &  silver badge 

        if (question.upVote.length % 5 === 0) {
            console.log(`You have earned 50 points and an additional silver badge for ${question.upVote.length} votes`);
            const updatedUser = await Users.findByIdAndUpdate(
                { _id: postedUserId },
                {
                    $inc: { EarnedPoints: 50, SilverBadge: 1 }
                },
                { new: true }
            );

            res.status(200).json({
                message: 'Congratulations..You have earned  a silver badge and 50 points',
                earnedPoints: updatedUser.EarnedPoints,
                silverBadge: updatedUser.SilverBadge,
                updatedUser,
            });
        }
        else {
            const updatedUser = await Users.findByIdAndUpdate(
                { _id: postedUserId },
                {
                    $inc: { EarnedPoints: 0, SilverdBadge: 0 }
                },
                { new: true }
            );

            res.status(200).json({
                earnedPoints: updatedUser.EarnedPoints,
                silverBadge: updatedUser.SilverBadge,
                updatedUser,
            });
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}