import productModel from "../models/product.model.js"



export async function createProduct(req,res) {
    console.log(req.body);
    console.log(req.file);
    res.status(200).json({
        message:"dummy response"
    })
}