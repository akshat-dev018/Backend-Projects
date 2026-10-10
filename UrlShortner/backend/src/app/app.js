import express from "express"
import urlRoutes from "../routes/url.routes.js"
import urlModel from "../model/url.model.js";

const app = express();

app.use(express.json())

app.use("/api/url",urlRoutes);


// http://localhost:3000/shortCode => redirect to original url
app.get("/:code",async function (req,res){

    const {code} = req.params;

    const url = await urlModel.findOne({
        shortCode:code
    });

    if(!url){
        return res.status(404).json({error:"url not found"})
    }

    // shortCode is redirected to original url
    res.redirect(302,url.originalUrl);

// find the original url from db on basis of shortCode and update the click
    await urlModel.findOneAndUpdate({
        shortCode:code,
    },{
     $inc:{clicks:1}
    })

})

export default app