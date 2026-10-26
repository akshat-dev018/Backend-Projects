const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData,validateLoginData} = require("./utils/validation");
const bcrypt = require("bcrypt");


const app = express();

app.use(express.json());

app.post("/signup", async (req,res)=>{

    try {
    // Validation of data
    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);

    // creating a new instance of the user model
    const user = new User({
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

        const user = await User.findOne({
            emailId: emailId.trim().toLowerCase()
        })
        
        if(!user){
            return res.status(401).send("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
            password,user.password
        )

        if(!isPasswordValid){
            return res.status(401).send("Invalid email or password");
        }else{
        res.status(200).send("Login successful");
        }



    } catch (error) {
        res.status(400).send("ERROR : "+ error.message);
    }
})

// getting single user
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({emailId:userEmail});
        if(!user){
        res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

// Feed API = GET /feed - get all the users from the database
app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch (err){
        res.status(400).send("something went wrong")
    }
});

// delete
app.delete("/user",async (req,res)=>{

    const userId = req.body.userId;

    try {
        const userId = await User.findByIdAndDelete(userId);

        res.send("user deleted successfully")
    } catch (err) {
        res.status(400).send("Something went wrong");  
    }
})

// update data of user
app.patch("/user/:userId",async (req,res)=>{

    const userId = req.params?.userId;
    const data = req.body;

   
    try {
    const user =  await User.findByIdAndUpdate({_id:userId  },data,{
        returnDocument:"before",
        // it gives the previous data stored inside mongodb 
        runValidators:true,
      });
      
    const ALLOWED_UPDATES = [
    "photoUrl","about","gender","age","skills"
    ]
    const isUpdateAllowed = Object.keys(data).every((k)=>
    ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }

    if(data?.skills.length>10){
        throw new Error("Skills can not be more than 10");
    }


      console.log(user);
      res.send("user updated successfully");
    } catch (err) {
        res.status(400).send("Update Failed :"+ err.message);
    }

})

connectDB().then(()=>{
    console.log("database connection established");

    app.listen(3000,()=>{
    console.log("server is connected to port 3000");
})
}).catch(err=>{
    console.error("database connection can not be established");
});

