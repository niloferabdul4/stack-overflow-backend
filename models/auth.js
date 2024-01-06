import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] },
    joinedOn: { type: Date, default: Date.now },
    NoOfQuestionsPosted: { type: Number, default: 0 },
    NoOfAnswersPosted: { type: Number, default: 0 },
    EarnedPoints: { type: Number, default: 0 },
    GoldBadge:{type:Number,default:0},
    SilverBadge:{type:Number,default:0},
    SubscriptionPlan:{type:String,default:'free'},
    StripeCustomerId:{type:String}

})
export default mongoose.model("User", userSchema);