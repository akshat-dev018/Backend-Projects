import express from "express"
import generateCodes from "../utils/generateCode.js"
import urlModel from "../model/url.model.js";
import shortCode from "../utils/generateCode.js";

const router = express.Router();

// making the url short .. expect long url
router.post("/",async function (req,res) {

    const {url} = req.body;

    if(!url){
        return res.status(400).json({error: "URL is required"});
    }

    if((url.startsWith("https://") == false) && (url.startsWith("http://") == false)){
        return res.status(400),json({error:"Please enter a valid url starting with http:// or https://"})
    }

    if(url.length>2048){
        return res.status(400).json({error:"url is too long. Maximum length is 2048 characters"})
    }
    
    // generate 6 digit short code for url
    const code = generateCodes();

    const newUrl = await urlModel.create({
        originalUrl: url,
        shortCode: code,
    })

    return res.status(201).json({
        message: "URL shortend successfully",
        data:{
            originalUrl:newUrl.originalUrl,
            shortCode:newUrl.shortCode
        }
    })

})


// fetch all url from db
router.get("/",async function (req,res){

    const urls = await urlModel.find(); 

    return res.status(200).json({
        message:"Url fetched successfully",
        data:{
            urls
        }
    })
    
})

// delete url form db 
router.delete("/:id", async function (req,res) {

    const {id} = req.params

    const url = await urlModel.findById(id);

    if(!url){
        res.status(404).json({
            message: "url not found"
        })
    }

    await urlModel.findByIdAndDelete(id);

    return res.status(200).json({
        message : "url deleted successfully",
    })

})

export default router