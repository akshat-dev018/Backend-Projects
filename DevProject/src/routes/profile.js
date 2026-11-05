const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const {validateEditProfileData, validateEditPassword} = require("../utils/validation");
const UserModel = require("../models/user");
const user = require("../models/user");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view",userAuth, async (req,res)=>{
try {
   const user = req.user;

   res.status(200).send(user);
} catch (error) {
    res.status(400).send("ERROR :" + err.message);
}
});


profileRouter.patch("/profile/edit",userAuth,validateEditProfileData, async(req,res)=>{

    try {
        const { emailId } = req.body;

if (emailId) {
    const existingUser = await UserModel.findOne({ emailId });

    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }
}

     const loggedInUser = req.user; //this user has been attached by userAuth

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

         await loggedInUser.save();

        res.status(200).json({
                message:(`${loggedInUser.firstName}, your profile updated successfully`),
                data:loggedInUser,
            });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }

})

profileRouter.patch("/profile/editPassword",userAuth,validateEditPassword,async(req,res)=>{

    try {

        const loggedInUser = req.user;

        const {currentPassword,newPassword} = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                message:"Both passwords are required"
            })
        }


        const isPasswordValid = await bcrypt.compare(
            currentPassword,loggedInUser.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        if(newPassword.length<6){
            return res.status(400).json({
                message:  "New password must be at least 6 characters"
            });
        };

        const hashPassword = await bcrypt.hash(newPassword,10);

        loggedInUser.password = hashPassword;

        await loggedInUser.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

})

module.exports = profileRouter;