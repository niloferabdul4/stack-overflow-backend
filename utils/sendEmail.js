import dotenv from 'dotenv'

dotenv.config()

export const sendEmail=(email,otp,res)=>{
  
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Sending Email for OTP Verification',
      text: `OTP: ${otp}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
     // console.log(mailOptions)
      if (error) {
        console.error("Error sending email:", error);
      return res.status(400).json({ success: false, message: 'Email not sent', error: error.message });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
      }
    });
  }
  