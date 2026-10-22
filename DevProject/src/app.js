const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express();

app.use(express.json());

app.post("/signup", async (req,res)=>{
    const user = new User(req.body);
        
    // creating a new instance of the user model
    try {
        await user.save();
        res.send("user added successfully")
    } catch (error) {
     res.status(400).send("error saving the user:"+ error.message)   
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

