const express = require("express");
const authRouter = express.Router();
const {validateSignUpData,validateLoginData} = require("../utils/validation");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req,res)=>{

    try {
    // Validation of data
    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);

    // creating a new instance of the user model
    const user = new UserModel({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    });
    
        await user.save();
        res.send("user added successfully")
    } catch (error) {
     res.status(400).send("ERROR : "+ error.message)   
    }
    
})


authRouter.post("/login", async (req,res)=>{

    try {
        
        validateLoginData(req);

        const {emailId,password} = req.body;

        const user = await UserModel.findOne({
            emailId: emailId.trim().toLowerCase()
        })
        
        if(!user){
            return res.status(401).send("Invalid email or password");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            // Create a jwt token
        const token = await user.getJWT()
            
            // Add the token to cookie and send the res back to the user
            res.cookie("token",token,{
                expires: new Date(Date.now()+ 1*3600000) //cookies expires in 1 hour
            });
            res.status(200).send("Login successful");
        }
        else{
        return res.status(401).send("Invalid email or password");
        }



    } catch (error) {
        res.status(400).send("ERROR : "+ error.message);
    }
})


authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()), //expire the cookie immediately
    });
    res.send("Logout Successfully");
})

module.exports = authRouter;