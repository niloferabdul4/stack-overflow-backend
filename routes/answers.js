import express from 'express'
import { postAnswer,deleteAnswer } from '../controllers/answers.js'
import auth from '../middlewares/auth.js'
const router=express.Router()

router.patch('/post/:id',auth,postAnswer)
router.patch('/delete/:id',auth,deleteAnswer)        // using patch=> since we are updatg the question by removing only the particular answer fronm the question
                                               // id here => id of the question
export default router;