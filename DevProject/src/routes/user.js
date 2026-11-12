const express = require("express");
const userRouter = express();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionReq");

const USER_SAFE_DATA = "firstName lastName"

// GET all the pending connection request for the logged in user
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",["firstName","lastName"]);

        res.status(200).json({
            message:"Data Fetched Successfully",
            data: connectionRequest
        })

    } catch (error) {
        return res.status(400).json({
            message: "Error:" + error.message
        })
    }

})

//
userRouter.get("/user/connections",userAuth, async(req,res)=>{

    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"}
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) =>{ 
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        });

        res.status(200).json({
            message:"Connections found successfully",
            data
        })


    } catch (error) {
       return res.status(400).json({
         message: "Error:" + error.message
        }) 
    }

})

module.exports = userRouter;