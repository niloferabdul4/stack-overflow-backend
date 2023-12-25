import mongoose from "mongoose";

const userOTPSchema=mongoose.Schema({
    email:{type:String,required:true},
    OTP:{type:String,required:true},
   
})

export default mongoose.model("UserOTPS",userOTPSchema)