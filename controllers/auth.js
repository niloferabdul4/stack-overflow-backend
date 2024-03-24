import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../models/auth.js";

//register fn

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // check if the email already exist

        const existinguser = await users.findOne({ email });
        if (existinguser) 
        {
            return res.status(404).json({ message: "User already Exist." });
        }
        const hashedPassword = await bcrypt.hash(password, 10)              // hash the password

        // create a new user
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,

        });

        // create a token                             
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
           process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ result: newUser, token });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }

}

//login fn
export const login = async (req, res) => {
    const {email, password } = req.body;
    try {
        const existinguser = await users.findOne({ email });
        if (!existinguser) {
            return res.status(404).json({ message: "User don't Exist." });
        }
        const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
        if (!isPasswordCrt) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { email: existinguser.email, id: existinguser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ result: existinguser, token });
    } catch (error) {
        res.status(500).json("Something went worng...");
    }
}





