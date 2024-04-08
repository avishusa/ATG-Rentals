import User from "../models/user.model.js";
// import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import {errorHandler} from '../utils/error.js'

export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;
  // const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res.status(201).json("User created successfully !");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res,next) => {
  const { username,password } = req.body;
  // const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    const validUser = await User.findOne({username});
    if(!validUser) return next(errorHandler(404,'User Not Found !'))
    const validPass = await User.findOne({password});
    if(!validPass) return next(errorHandler(401,'Invalid Password !'))
    const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
    const {password : pass,...rest} = validUser._doc;
    res.cookie('access_token',token,{httpOnly : true}).status(200).json(rest)
  } catch (error) {
    next(error);
  };
}

  export const google_signup= async (req,res,next) =>{
    try {
      const user= await User.findOne({email:req.body.email })
      if(user){
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        const {password : pass,...rest} = user._doc;
        res.cookie('access_token',token,{httpOnly : true}).status(200).json(rest)
      }else{
        const generatePass = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8)
        const newUSer= new User({username:req.body.name.split(" ").join("").toLowerCase() + +  Math.random().toString(36).slice(-3),email:req.body.email,password:generatePass,profile_pic:req.body.photo})
        await newUSer.save()
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        const {password : pass,...rest} = newUSer._doc;
        res.cookie('access_token',token,{httpOnly : true}).status(200).json(rest)
      }
    } catch (error) {
      next(error)
    }
  }

