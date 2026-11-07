import productModel from "../models/product.model.js"
import { uploadFiles } from "../../services/storage.service.js";


export async function createProduct(req, res, next) {
    try {
        const files = req.files ?? [];

        if (!files.length) {
            return res.status(400).json({
                message: "At least one product image is required"
            });
        }

        // Upload all images concurrently
        const uploadResponses = await Promise.all(
            files.map(file =>
                uploadFiles({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
            )
        );

        // Extract image URLs
        const fileUrls = uploadResponses.map(
            response => response.url
        );

        // Create product in database
        const product = await productModel.create({
            title: req.body.title,
            description: req.body.description,
            price: {
                amount: req.body.price.amount,
                currency: req.body.price.currency
            },
            sizes: req.body.sizes,
            images: fileUrls,
            seller: req.user.userId
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: {
                product
            }
        });

    } catch (error) {
        next(error);
    }
}


export async function listAllProducts(req,res) {
    
    const products = await productModel.find({published:true});

    res.status(200).json({
        message: "Products data fetched successfully ",
        data:{
            products
        }
    })
}

export async function listAllProductsToSeller(req,res) {
    const products = await productModel.find({})

    return res.status(200).json({
        message:"All products fetched successfully",
        data:{
            products
        }
    })
}

export async function unlistProduct(req,res) {
    
    const {id} = req.params

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            message:"Product not found by id",
        })
    }

    // make product unpublished
    await productModel.findByIdAndUpdate(id,{
        published:false
    })

    return res.status(200).json({
        message:"Product unlist successfully "
    })

}

export async function listProduct(req,res) {
    
    const {id} = req.params

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            message:"Product not found by id",
        })
    }

    // make product unpublished
    await productModel.findByIdAndUpdate(id,{
        published:true
    })

    return res.status(200).json({
        message:"Product listed successfully "
    })

}