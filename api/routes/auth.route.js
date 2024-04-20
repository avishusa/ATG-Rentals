import express from "express";
import {
  signin,
  signup,
  google_signup,
  signOut
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google-signup", google_signup);
router.get('/signout',signOut)

export default router;
