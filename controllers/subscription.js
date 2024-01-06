import mongoose from "mongoose";
import Users from "../models/auth.js";
import Questions from "../models/questions.js";
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
const stripe = Stripe('sk_test_51OUtL2DFzqSUPDL5YMx8QP44iFE2fMoFCfVWw5XYGtrY7TIQpReVkkptWKwcPkXFreNXyhvPMVG5JLqSPVy79OHD00vaBkkLYL');


export const updatePlan = async (req, res) => {
    try {
        const { plan, userId } = req.body;
        let message;
        switch (plan) {
            case 'free':
                message = 'You have subscribed to Free plan.You can post 1 question per day';
                break;
            case 'silver':
                message = 'You have subscribed to Silver plan.You can post 5 questions per day';
                break;
            case 'gold':
                message = 'You have subscribed to Gold plan.You can post unlimited questions per day';
                break;
            default:
                return res.status(400).json({ message: 'Invalid plan' });
        }
        const updatedUser = await Users.findByIdAndUpdate({ _id: userId }, { SubscriptionPlan: plan }, { new: true })
        //console.log(updatedUser)
        res.status(200).json({ plan: updatedUser.SubscriptionPlan, updatedUser, message })
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

export const checkout = async (req, res) => {
    try {
        const { userId, plan, amount } = req.body
        const user=await Users.findById(userId)
        let adjustedAmount = amount;
        switch (plan) {

            case 'silver':
                adjustedAmount = 100;
                break;
            case 'gold':
                adjustedAmount = 1000;
                break;
            default:
                return res.status(400).json({ message: 'Invalid plan' });
        }
        //create a paymentIntent with the subscription amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: adjustedAmount * 100, 
            currency: 'inr',
            description: `Subscription payment for ${plan} plan by ${user.name}`,
            customer: user.StripeCustomerId, 
            payment_method_types: ['card'],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        res.status(500).json(error.message)

    }
}

export const handleQuota = async (req, res) => {
    try {
        const { userId, date } = req.body
        const user = await Users.findById(userId)
        const userPlan = user.SubscriptionPlan
        let quotaLimit;
        switch (userPlan) {
            case 'free':
                quotaLimit = 1;
                break;
            case 'silver':
                quotaLimit = 5;
                break;
            case 'gold':
                quotaLimit = Infinity;
                break;
            default:
                return res.status(400).json({ message: 'Invalid userPlan' });
        }

        //find and get the last posted question by the user

        const LastPostedQuestionsWithSameDate = await Questions.find({
            userId: userId,
            askedOn: {
                $gte: new Date(date).setHours(0, 0, 0, 0), // Start of the day
                $lt: new Date(date).setHours(23, 59, 59, 999) // End of the day
            }
        });
        console.log('lastpostedquestions:', LastPostedQuestionsWithSameDate)
        if (LastPostedQuestionsWithSameDate) {
            //  const LastQuestionDate = LastPostedQuestion.askedOn.toLocaleDateString()

            // check if the last posted quest date and 'askquestion' btn clicked date is same
            if (LastPostedQuestionsWithSameDate.length >= quotaLimit) {
                return res.status(400).json({
                    message: `Your quota exceeded. You can post only ${quotaLimit} question(s) per day`
                });
            }


        }

        return res.status(200).json({ message: 'Checked Quota Limit..' });


    }
    catch (error) {
        res.status(500).json(error.message)
    }
}