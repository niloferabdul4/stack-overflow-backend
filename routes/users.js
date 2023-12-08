import express from 'express'
import {login,signup } from '../controllers/auth.js';
import { getAllUsers,updateProfile } from '../controllers/users.js';
import auth from '../middlewares/auth.js';

 const router=express.Router()

router.post('/signup',signup)            // if the request is sign up ie.(if the url is 'user/signUp') ,this signup fn(present in auth.js) executed)
router.post('/login',login)             // if the request is login ie.(if the url is 'user/login'),login fn executed
router.get("/getAllUsers", getAllUsers);
router.patch('/update/:id',auth,updateProfile)

export default router;