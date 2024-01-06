import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './connectMongoDB.js'
import UserRoutes from './routes/users.js'
import QuestionRoutes from './routes/questions.js'
import AnswerRoutes from './routes/answers.js'
import ChatRoutes from './routes/chat.js'
import SubscriptionRoutes from './routes/subscription.js'


const app=express()                 // create a express server
dotenv.config()
app.use(express.json({limit:'30mb',extended:true}))           //send response as json with a limit and can be extended if needed
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use(cors())
app.use(bodyParser.json())


app.get('/',(req,res)=>{
    res.send("This is a stack overflow clone API")
})


app.use('/user',UserRoutes)                      // localhost:/user/
app.use('/questions',QuestionRoutes)             // localhost:/questions
app.use('/answer',AnswerRoutes)
app.use('/chatbot',ChatRoutes)
app.use('/subscription',SubscriptionRoutes)
//create PORT


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//connect to mongodb
connectDB();
