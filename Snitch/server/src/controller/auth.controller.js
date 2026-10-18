import userModel from "../models/users.module.js"
import bcrypt from "bcryptjs"
import { createAccessToken,createRefreshToken,readRefreshToken } from "../utils/auth.utils.js";

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
                path:"email",
                msg:"User already exist with this email"
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

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true
    })

    await userModel.findByIdAndUpdate(user._id,{
        refreshToken
    })

    res.status(201).json({
        message:"User Registered Successfully",
        data:{
            user:{
                email: user.email,
                name:user.name,
                id:user._id,
            },
            accessToken
        }
    })

}


export async function login(req,res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.passwordHash);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    // when user login we need a new access and refresh token
    const accessToken = createAccessToken({
        userId: user._id,
        role:user.role
    })

    const refreshToken = createRefreshToken({
        userId:user._id,
        role:user.role
    })

    //updating refresh token and saving in db
    await userModel.findOneAndUpdate({
        email
    },{
        refreshToken
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true
    })

    res.status(200).json({
        message:"user loggedIn successfully",
        data:{
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            },
            accessToken
        }
    })

}


export async function refresh(req,res) {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message:"Refresh token is required"
        })
    }

    try {
        
        const decoded = readRefreshToken(refreshToken);

        const {userId,role} = decoded

        const user = await userModel.findById(userId);

    //refreshToken coming from cookie is not equal to refreshToken saved in db
        if(refreshToken!=user.refreshToken){
            await userModel.findByIdAndUpdate(user._id,{
                refreshToken:null
            })

            return res.status(401).json({
                message:"Refresh Token mismatch"
            })
        }

        //if matched
        const accessToken = createAccessToken({
            userId,role
        })

        const newRefreshToken = createRefreshToken({
            userId,role
        })

        await userModel.findByIdAndUpdate(user._id,{
            refreshToken:newRefreshToken
        })

        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true
        })

        res.status(200).json({
            message:"Token rotated successfully",
            data:{
                user:{
                    email:user.email,
                    name:user.name,
                    id:user._id
                },
                accessToken
            }
        })

    } catch (error) {
        return res.status(401).json({
            message:"Invalid refresh token"
        })
    }

}


export async function getMe(req,res) {
    
    const {userId,role} = req.user

    const user = await userModel.findById(userId);

    res.status(200).json({
        message:"User data fetched successfully",
        data:{
            user:{
                email:user.email,
                name:user.name,
                id:user._id
            }
        }
    })

}
