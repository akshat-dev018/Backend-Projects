import userModel from "../models/users.module.js"
import bcrypt from "bcryptjs"
import { createAccessToken,createRefreshToken } from "../utils/auth.utils.js";

export async function register(req,res) {
    
    const {email,name,password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        email
    })

    if(isUserAlreadyExist){
        return res.status(400).json({
        message:"User already exist with this email address",
        errors:[
            {
                field:"email",
                message:"User already exist with this email"
            }
        ]
    })
        
    }

    const user = await userModel.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password,12)
    })

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })


}