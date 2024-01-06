import nodemailer from 'nodemailer'
import Users from "../models/auth.js";
import UserOTP from '../models/userotp.js'
import dotenv from 'dotenv'

dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


const sendEmail = (mailOptions,res) => {

     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(400).json({ success: false, message: 'Email not sent', error: error.message });
        } else {
            console.log("Email sent:", info.response);
            res.status(200).json({ success: true, message: 'Email sent successfully' });
        }
    });
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
       // console.log('server:',email)
        const existUser = await Users.findOne({ email })    // check the User (in UserSchema) with that email id
        if (!existUser) {
            res.status(404).json({ message: 'User Not Found In DB' })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();  //generate random otp 
        const OTPExpirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes expiration
        const userWithOTP = await UserOTP.findOne({ email })        // check  user with this email exist in userotb schem

        // if OTP already exist in user,update OTP of that user

        if (userWithOTP) {
            const updateOTPUser = await UserOTP.findByIdAndUpdate(
                { _id: userWithOTP._id },
                { OTP: otp ,OTPExpirationTime:OTPExpirationTime},
                { new: true })
            await updateOTPUser.save()
            //sendEmail(email,otp,res);

            var mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Sending Email for OTP Verification',
                text: `OTP: ${otp}`
            };
            sendEmail(mailOptions,res)
        }
        // if there is no OTP in user,create a new OTP
        else {
            const saveOTPUser = new UserOTP({ email: email, OTP: otp,OTPExpirationTime:OTPExpirationTime})
            await saveOTPUser.save();
            //sendEmail(email,otp,res);
            sendEmail(mailOptions,res)
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const verifyOTP=async(req,res)=>{
    try{
    const {OTPInput,OTPEnteredTime,email}=req.body
    const existUser=await UserOTP.find({email})

    if(!existUser)
    {
        return res.status(404).json({message:'User does not exist'})
    }

    if(OTPInput===existUser[0].OTP) 
    {
        if(OTPEnteredTime<existUser[0].OTPExpirationTime )
        {
        return res.status(200).json({message:'Email Verified Successfully'})
        }
        else{
            return res.status(400).json({message:'Your OTP has expired'})
        }
       
    }
    else{
        return res.status(400).json({ message: "Invalid OTP" });
    }
}
catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}
}