// creating multiple routes
const express = require("express");

const app = express();

app.use("/user",[(req,res,next)=>{
    console.log("Handling the route user");
    // res.send("Response");
    next();
},
    (req,res,next)=>{
    console.log("Handling the route user 2");
    res.send("Response 2");
    // next();
    }],
    (req,res,next)=>{
    console.log("Handling the route user 3");
    res.send("Response 3");
    // next();
    },  
    (req,res,next)=>{
    console.log("Handling the route user 4");
    res.send("Response 4");
    // next();
    }
);


app.use("/user",(req,res,next)=>{
    console.log("Handling the route user");
    // res.send("Response");
    next();
})
app.use("/user",(req,res,next)=>{
    console.log("Handling the route user 2");
    // res.send("Response 2");
    next();
    });


// we can put all routes inside array or some particular routes

app.listen(3000,(req,res)=>{
    console.log("server is running on port 3000");
})