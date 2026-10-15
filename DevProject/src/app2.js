const express = require("express");

const app = express();

// app.use("/",(req,res)=>{
//     res.send("hello from akshat")
// })
// this function is known as req handler

// this will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstName:"Akshat", lastName:"Tiwari"});
})

// app.post("/user",(req,res)=>{
//     console.log("Save data to database");
//     res.send("Data successfully saved to database")
// })

// app.delete("/user",(req,res)=>{
//     res.send("delete successfully")
// })

// // this will match all the http method API calls to /test
// app.use("/test",(req,res)=>{
//     res.send("hello from akshat")
// })


//  app.get("/ab?c",(req,res)=>{
//     res.send({firstName:"Akshat", lastName:"Tiwari"});
// })
//THIS QUESTION MARK SAY'S b IS OPTIONAL   

//  app.get("/.*fly$/",(req,res)=>{
//     res.send({firstName:"Akshat", lastName:"Tiwari"});
// })
// STARTING CAN BE ANYTHING BUT ENDING SHOULD HAVE FLY

//  app.get("/ab?c",(req,res)=>{
    // console.log(req.query)
//     res.send({firstName:"Akshat", lastName:"Tiwari"});
// })
// query is used for taking url parameters like id etx

// dynamic route
//  app.get("/user/:userId",(req,res)=>{
    // console.log(req.params);
//     res.send({firstName:"Akshat", lastName:"Tiwari"});
// })


app.listen(3000,(req,res)=>{
console.log("server is connected")
})