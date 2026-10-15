const express = require("express");

const app = express();


// GET/user => it checks all the app.xxx("matching route")functions
// request handlers are those which are sending the data back
// req handlers which are coming in between are => midlleware chain

app.use("/",(req,res,next)=>{
    // res.send("handling /route");
    next();
});

app.get("/user",(req,res,next)=>{
    console.log("handling /user route");
    next();
},
(req,res,next)=>{
    next();
},
(req,res,next)=>{
    res.send("2nd route handler")
    next();
},

)

app.listen(3000,(req,res)=>{
    console.log("server is running on port 3000")
})