import express from 'express'
import OpenAIAPI from 'openai';
import dotenv from 'dotenv'


const router = express.Router()
dotenv.config()

/*****  Open AI   *******/

const openai = new OpenAIAPI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/send', async (req, res) => {

    const { prompt } = req.body                     //getting prompt from req body
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'assistant', content: prompt }],           //arry of object with 2 fields role and content  role->assistant  content->prompt(our question)
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
       console.log(response)
        res.send(response.data.choices[0].message.content)
    }
    catch (error) {
        res.status(500).send(error)
    }

}
)         // (endpoint,controller fn)

export default router;