import express from 'express';
import { registerUser, verifyUser,login, getMe,logOutUser,forgotpassword,resetPassword,changePassword } from '../controller/user.controller.js';
import { isloggedIn } from '../middleware/auth.middilware.js';


const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});
router.post("/register",registerUser) 
router.get("/verify/:token", verifyUser)
router.post("/login", login);
router.get("/me", isloggedIn, getMe);
router.get("/logout", isloggedIn,logOutUser);


export default router;