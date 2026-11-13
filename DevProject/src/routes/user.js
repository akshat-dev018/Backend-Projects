const express = require("express");
const userRouter = express();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionReq");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

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

//it's a match 
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


userRouter.get("/feed",userAuth, async(req,res)=>{

    try {
        
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>20 ? 20:limit;
        const skip = (page-1)*limit;

        //find connection req that i have (send + received)
        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id},
            ]
        }).select("fromUserId toUserId");

        // hide them from the feed 
        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await user.find({
          $and: [
             { _id: { $nin: Array.from(hideUsersFromFeed) }},
            { _id: { $ne: loggedInUser._id }}
            ],
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.status(200).json({
            data:users
        })

    } catch (error) {
        return res.status(400).json({
            message:"ERROR:" + error.message,
        })
    }
}) 

module.exports = userRouter;