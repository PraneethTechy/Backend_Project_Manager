import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const userRegister = async (req,res) => {
    const {username,email,password} = req.body;

    try{
        const emailExist = await User.findOne({email});
        if(emailExist){
            return res.status(400).json({message: "Email already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({username,email,password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: " User registered Successfully "});
        } catch(err){
            console.error(err);
            res.status(500).json({error: "Server error"});
        }
}

export const userLogin = async (req,res) => {
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({message: "Login successful",token});

    } catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
}


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


