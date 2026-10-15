const express = require("express");
const {adminAuth,userAuth} = require("./middleware/auth");

const app = express();

app.use("/admin",adminAuth);

// app.use("/user",userAuth);

app.get("/user/login",(req,res)=>{
    res.send("user logged in ");
});//here we do not need the middleware cuz login shall be open for everyone

app.get("/user/data",userAuth,(req,res)=>{
    res.send("user data send")
})

app.get("/admin/getAllData",(req,res)=>{
    res.send("all data send");
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("DELETED a user");
})

app.listen(3000,(req,res)=>{
    console.log("server is running on port 3000")
})