import e from "express";
import User from "../models/User_models.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { request } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

dotenv.config();

const registerUser = async(req,res)=>{
    // get data
    const {name, email, password} = req.body;

    // validate data

    // check if user exists
    // create user in db
    // gerrateverificationtoken
    // save verification token
    // send email with verification token
    // send response success massage
    console.log(email)

    if(!name || !email || !password){
        return res.status(400).json({
            message: "All fields are required",
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            message: "Password must be at least 6 characters",
        })
    }
    if(!email.includes('@') || !email.includes('.')){
        return res.status(400).json({
            message: "Invalid email address",
        })
    }

    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "User already exists",
            })
        }
        const user = await User.create({
            name,
            email,
            password,
        })
        console.log(user)

        if(!user){
            return res.status(400).json({
                message: "User not created",
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        console.log(token)
        user.verificationToken = token
        await user.save()

        // send eamil
        

        const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_USER, // generated ethereal user
            pass: process.env.MAILTRAP_PASSWORD, // generated ethereal password
            },
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Verify your email ✔", // Subject line
            text: "Hello world?", // plain text body
            text: `please click the follwing link ${process.env.BASE_URL}/api/v1/user/verify/${token}`, // html body
        };
        console.log(mailOption)

   transporter.sendMail(mailOption)
  res.status(200).json({
      message: "User created successfully",
      success: true,
    })

    }
    catch(error){
    res.status(400).json({
        message: "User not resistered",
        success: false,
        error
        
      })
        
    }
};

// const verifyUser 

const verifyUser = async(req , res)=> {
    // get token from params
    // validate token
    //  find user by token
    // update user isVerified to true
    // remove token from user
    // save user
    // send response success message

    const {token} = req.params;
    console.log(token)
    if(!token){
        return res.status(400).json({
            message: "Invalid token",


        })
    }
    const user = await User.findOne({verificationToken: token})
    if(!user){
        return res.status(400).json({
            message: "Invalid token",
        })
    }
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()
    res.status(200).json({
        message: "User verified successfully",
        success: true,
    })
    console.log(user.isVerified)
    // console.log(user)

}


const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message: "All fields are required "
        })

    }
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        console.log(isMatch)

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }
        if(!user.isVerified){
            return res.status(400).json({
                message:"User not verified"
            });
        }

        const token = jwt.sign({
            id:user._id, role: user.role
        },
        process.env.JWT_SECRET,{
        expiresIn: "24h"
        }
    );
    const cookieOptons = {
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000,
    }

    res.cookie("test",token,cookieOptons)
    res.status(200).json({
        message:"Login successful",
        success: true,
        token,
        user:{
            id: user._id,
            name:user.name,
            role:user.role
        }
    })

    } catch (error) {
        res.status(400).json({
            message:"Invalid email or password",
            success: false,
            error

        });

        
    }

}


const getMe = async (req, res)=>{
    try {
       const user = await User.findById(req.user.id).select("-password")
         if(!user){
          return res.status(400).json({
                message: "User not found",
                success: false,
          })
         }

        res.status(200).json({
            message: "User found",
            success: true,
            user
        })
        
    } catch (error) {
        res.status(400).json({
            message: "User not found",
            success: false,
            error
        })
        
    }
}

const logOutUser = async (req, res)=>{
    try {
        res.cookie("test","",{
            // expires: new Date(0), //explore my self leter 

        })
        res.status(200).json({
            message: "User logged out successfully",
            success: true,
            
        })
        
    } catch (error) {
        res.status(400).json({
            message: "User not logged out",
            success: false,
            error
        })
        
    }
}


const forgotpassword = async (req, res)=>{
    try {

        // get email from body
        // find user by email
        // generate reset password token
        // resettoken and expires => date.now + 10 min
        // save user
        // send email with reset password link =>design url
        // send response success message 
        
    } catch (error) {
        res.status(400).json({
            message: "User not found",
            success: false,
            error
        })
        
    }
}


const resetPassword = async (req, res)=>{
    try {
        // get token from params
        // get password from body
        // find user by token =>
            const {token} = req.params;
            const {password} = req.body;
            try {
                const user = await User.findOne({
                    resetPasswordToken: token,
                    resetPasswordExpires: {$gt: Date.now()}
                })

                // set password in user
                // remove token and expires from user
                // save user
                // send response success message
            } catch (error) {
                
            }
        // validate token
        // update password
        // remove token and expires from user
        // save user
        // send response success message
        
    } catch (error) {
        
    }
}

const changePassword = async (req, res)=>{
    try {
        // get password from body
        // find user by id
        // check if password is correct
        // update password
        // save user
        // send response success message
        
    } catch (error) {
        
    }
}



export {registerUser, verifyUser, login, getMe, logOutUser, forgotpassword, resetPassword, changePassword};



