const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req,res,next)=>{

   try {
    const cookies = req.cookies;

    const {token} = cookies;

    if(!token){
        throw new Error("Token is not valid");
    }

    const decodedData = await jwt.verify(token,"DEV@Tinder$790");

    const {_id} = decodedData;

    const user = await UserModel.findById(_id);

    if(!user){
        throw new Error("User not found");
    }

    // we found the user just attach it to the req
    req.user = user;
    
    next();
}
    catch(error){
        res.status(400).send("ERROR:"+error.message)
    }

}


module.exports = {
    userAuth
}