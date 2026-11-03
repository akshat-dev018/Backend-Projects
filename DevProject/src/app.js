const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const {validateSignUpData,validateLoginData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth")


const app = express();

app.use(express.json());

app.use(cookieParser());

app.post("/signup", async (req,res)=>{

    try {
    // Validation of data
    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password
        const passwordHash = await user.validatePassword(password);

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

// Login Api
app.post("/login", async (req,res)=>{

    try {
        
        validateLoginData(req);

        const {emailId,password} = req.body;

        const user = await UserModel.findOne({
            emailId: emailId.trim().toLowerCase()
        })
        
        if(!user){
            return res.status(401).send("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
            password,user.password
        )

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

// profile
app.get("/profile",userAuth, async (req,res)=>{
try {
   const user = req.user;

   res.status(200).send(user);
} catch (error) {
    res.status(400).send("ERROR :" + err.message);
}
});


app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    
})


connectDB().then(()=>{
    console.log("database connection established");

    app.listen(3000,()=>{
    console.log("server is connected to port 3000");
})
}).catch(err=>{
    console.error("database connection can not be established");
});

