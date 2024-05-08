import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "hello",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(401, "You can only update your own account"));

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profile_pic: req.body.profile_pic,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can only view your own listings!"));
  }
};

export const getUser = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    if(!user) return next(errorHandler(404,'User not found!'))
    const {password : pass , ...rest}=user._doc;
  res.status(200).json(rest)

  } catch (error) {
    next(error)
  }
}
