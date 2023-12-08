import mongoose from "mongoose";
import Questions from "../models/questions.js";

/**********   Post Answer  ***********/

export const postAnswer = async (req, res) => {
    
    const { id: _id } = req.params;
    const { noOfAnswers, answerBody, userAnswered,userId } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id))                // if the id is not valid
    {
        res.status(404).send('Question Unavailable')
    }
    updateNoOfQuestions(_id, noOfAnswers);
    try {
        // find by id and add a new value to 'answer' array
        const updatedQuestion = await Questions.findByIdAndUpdate(_id, {
            $addToSet: { answer: [{ answerBody, userAnswered,userId }] }
        })
        res.status(200).json(updatedQuestion)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


/**********   Update No Of Questions    **************/

const updateNoOfQuestions = async (_id, noOfAnswers) => {
    try {
        await Questions.findByIdAndUpdate(_id, {
            $set: { noOfAnswers: noOfAnswers },                  // only updating (not adding new value)
        });
    } catch (error) {
        console.log(error);
    }
};

/*************  Delete Answer Controller   **************/

export const deleteAnswer=async(req,res)=>{               // receiving the req and res from the frontend

    const {id:_id}=req.params;                            
    const { answerId, noOfAnswers } = req.body;          // getting the answerId and noOfAns from the req body


    if(!mongoose.Types.ObjectId.isValid(_id))            // if the quest id is valid
    {
        res.status(404).send('Question Unavailable')
    }
    if(!mongoose.Types.ObjectId.isValid(answerId))         // if the answerId is valid
    { 
        res.status(404).send('Answer Unavailable')
    }
    updateNoOfQuestions(_id,noOfAnswers)
    try
    {
      await Questions.updateOne({_id},            //pass the question id
                                {$pull:{answer:{_id:answerId}}})  //update the ans array by deleting a particular answer
                                                                 // pull the particular answer from the answer array if it matches the answerId(got when clicking the delete btn)

      res.status(200).json({ message: "Successfully deleted..." });
      
    }
    catch(error){
        res.status(400).json({ message: error.message })
    }

}