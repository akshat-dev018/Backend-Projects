import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email :{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    passwordHash:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
        enum:["user","seller"]
        // enum means ki iss role property ki user ya seller m se hi koi property
        // ho skti koi 3rd property nhi aa skti
    },
    refreshToken:{
        type:String
    }
})

const userModel = mongoose.model("users",userSchema);

export default userModel