
import Questions from "../models/questions.js";
import Users from "../models/auth.js";
import mongoose from "mongoose";


export const AskQuestion = async (req, res) => {
    try {
        const postQuestionData = req.body;       

        /*** post new question to Questions Model  *******/
        
        const postQuestion = new Questions(postQuestionData);
        await postQuestion.save();
        res.status(200).json({ message: 'Posted a question successfully' })

    }
    catch (error) {
        console.log(error)
        res.status(409).json({ message: 'Couldn\'t post a question' })
    }

}

// GetAllQuestions  (get data from database)

export const getAllQuestions = async (req, res) => {
    try {

        /*******  find all questions in Questions Model  **********/
        const questionList = await Questions.find()
        res.status(200).json(questionList)

    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }

}

/*********  Delete Question *************/

export const deleteQuestion = async (req, res) => {

    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Question Unavailable')
    }

    try {
        await Questions.findByIdAndDelete(_id)
        res.status(200).json({ message: 'Successfully Deleted' })
    }


    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/******  Vote Question   ***********/

export const voteQuestion = async (req, res) => {
    const { id: _id } = req.params
    const { value, earnedPoints, silverBadge } = req.body;
    const userId = req.userId;
    let points = earnedPoints
    let silverbadge = silverBadge;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        res.status(404).send('Question Unavailable')
    }
    try {
        const question = await Questions.findById(_id)                // get the particular question and assign to'qusetion' variable

        // map throught the 'upVote' array in the 'question' object and 
        // find the item whose id is equal to current userId and then store in upIndex
        // ie) if the current user id is there in the upVote array,assign that value to upIndex


        const upIndex = question.upVote.findIndex((id) => id === String(userId));
        const downIndex = question.downVote.findIndex(
            (id) => id === String(userId))


        /***
         * 3 conditions when user clicks the upVote
         *    1. checks whether the current user has already downvoted,if yes, then remove it from downVote array
         *    2. if the current user is new, then push it to upVote arry
         *    3. checks whether the current user has already upvoted,if yes, then remove it from upVote array
         */
        if (value === "upVote") {
            if (downIndex !== -1)   // if the current user has already downvoted,then remove this userid from the downvote array
            {
                question.downVote = question.downVote.filter((id) => id !== String(userId));
            }
            if (upIndex === -1)     //if the user is new, then push it to upVote arry
            {
                question.upVote.push(userId);

            }
            else {                      //if the current user has already upvoted,if yes, then remove it from upVote array
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
        }

        else if (value === "downVote") {
            if (upIndex !== -1) {
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
            if (downIndex === -1) {
                question.downVote.push(userId);
            } else {
                question.downVote = question.downVote.filter(
                    (id) => id !== String(userId)
                );
            }
        }

        //update the whole document
        await Questions.findByIdAndUpdate(_id, question)
        res.status(200).json({message:'Voted Successfully'}) 
    }
    catch (error) {
        res.status(404).json({ message: "id not found" });

    }
}
