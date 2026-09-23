const express = require("express");

const app = express();

app.use((req,res)=>{
    console.log("hello from server")
})
// this function is known as req handler

app.listen(3000,(req,res)=>{
console.log("server is connected")
})