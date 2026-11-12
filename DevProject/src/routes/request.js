const express= require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionReq");
const UserModel = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    
    try {
      const fromUserId = req.user._id
//the userAuth give me the user which is logged in 

    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // Status Validation
    const allowedStatus = ["ignored","interested"]
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid status type: " + status,
        })
    };

    // check if my toUserId exist in my db or not
    const toUser = await UserModel.findById(toUserId);
    if(!toUser){
        return res.status(404).json({
            message:"User not found"
        })
    };

    // user does not send connection req to themself
    if(fromUserId.toString()=== toUserId){
        return res.status(400).json({
            message: "You cannot send a request to yourself"
        })
    }

    // If there is an existing connectionRequest
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
       $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId, toUserId:fromUserId}
       ],
    });
// first we find fromUserId and toUserId exist then we check ki kya meri req
// fromUser se toUser and toUser se fromUser ko gyi hai  
    if(existingConnectionRequest){
        return res.status(400).json({
            message:"Connection Request Already Exist",
        })
    }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        
        res.json({
            message:req.user.firstName + " "+ status + " "  + toUser.firstName, 
            data,
        })

        // if both are connected 
        const alreadyConnected = await ConnectionRequestModel.findOne({
            $or:[
                {
                    fromUserId, toUserId,
                    status:"accepted"
                },
                {
                    fromUserId:toUserId,
                    toUserId:fromUserId,
                    status:"accepted"
                }
            ]
        });
        if(alreadyConnected){
            return res.status(400).json({
                message: "You are already connected with this user"
            });
        }

    } catch (error) {
        res.status(400).send("ERROR:" + error.message)
    }

});


requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{

    try {
        const loggedInUser = req.user;

        const { status , requestId} = req.params;

        //Validating Status 
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status not allowed"
            })
        }

        // Find is the request exist 
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status: "interested"
        });

        if(!connectionRequest){
            return res.status(404).json({
                message:"Connection request not found"
            })
        };

        connectionRequest.status = status;

       const data = await connectionRequest.save();

       res.status(200).json({
        message:req.user.firstName + " "+ status + " " + "your connection request",
        data,
       })
        
    } catch (error) {
        res.status(400).json({
            message:"ERROR" + error.message
        });
    }


});



module.exports = requestRouter;