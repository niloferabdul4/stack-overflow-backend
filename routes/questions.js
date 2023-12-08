import express from 'express'
import { AskQuestion,getAllQuestions,deleteQuestion,voteQuestion } from '../controllers/questions.js';
import { deleteAnswer } from '../controllers/answers.js';
import auth from '../middlewares/auth.js';
const router=express.Router()

router.post("/Ask", auth, AskQuestion);          //  submits data to a specified resource - localhost/questions/AskQuestion
router.get('/get',getAllQuestions)         // requesting data from a specified source     
router.delete('/delete/:id',auth,deleteQuestion)
router.patch('/answer/:id',auth,deleteAnswer)
router.patch('/vote/:id',auth,voteQuestion)        // check if the token is valid ,if yes the 'next' operation will be done ie)voteQuestion here
export default router;