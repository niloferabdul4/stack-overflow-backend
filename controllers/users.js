import mongoose from "mongoose"
import users from "../models/auth.js"

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find()
        const allUsersDetails = []
        allUsers.forEach((user) => {
            allUsersDetails.push({ _id: user._id, 
                name: user.name,
                 about: user.about, 
                 tags: user.tags, 
                 joinedOn: user.joinedOn,
                 noOfQuestionsPosted:user.NoOfQuestionsPosted,
                 upVotesForQuestion:user.UpVotesForQuestion,
                 noOfAnswersPosted:user.NoOfAnswersPosted,
                 earnedPoints:user.EarnedPoints,
                 goldBadge:user.GoldBadge,
                 silverBadge:user.SilverBadge,
                 subscriptionPlan:user.SubscriptionPlan,
                 stripeCustomerId:user.StripeCustomerId
                 })

        })

        // console.log(UsersList)
        res.status(200).json(allUsersDetails)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }

}

export const updateProfile = async (req, res) => {
    const { id: _id } = req.params
    const { name, about, tags } = req.body
    console.log('earnedPoints-updateProfilecontroller',earnedPoints)
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        res.status.send('User Unavailable')
    }
    try {
        const updatedProfile = await users.findByIdAndUpdate(_id,
            {  
                $set: { 'name': name, 'about': about, 'tags': tags } },
            { new: true })
        res.status(200).json(updatedProfile)
    }
    catch (error) {
        res.status(405).json({ message: error.message })               //405=>method not allowd
    }
}