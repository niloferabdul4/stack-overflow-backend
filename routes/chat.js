import express from 'express'
import OpenAIAPI from 'openai';
import dotenv from 'dotenv'
import { fetchAllMessages} from '../controllers/chats.js';
import { sendOTP,verifyOTP } from '../controllers/otp.js';
import mongoose from "mongoose";
import Chats from "../models/chat.js";

const router = express.Router()
dotenv.config()

/*****  Open AI   *******/

const openai = new OpenAIAPI({
    apiKey: process.env.OPENAI_API_KEY

});

router.post("/send", async (req, res) => {
    try {
        const textData = req.body  
        //console.log(textData)
        const {prompt,userId}=textData
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [    
                {                     //arry of object with 2 fields role and content  role->assistant  content->prompt(our question)
                "role": "user",
                "content":prompt
            },
        
            ],
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
       

        const botResponse=response?.choices[0].message.content
        // Send the response to the client
        res.send(botResponse)
       await Chats.create({prompt,botResponse,userId});
        
    }
    catch (error) {
        res.status(500).send(error)
    }

}
)



router.get("/get/:userId", fetchAllMessages)
router.post('/sendOTP',sendOTP)
router.post('/verifyOTP',verifyOTP)
export default router;