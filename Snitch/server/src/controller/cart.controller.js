import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js"


export async function addToCart(req,res) {
    
    const{productId,quantity,size} = req.body

    //does that product exist
    const product = await productModel.findById(productId);

    if(!product){
        return res.status(404).json({
            message:"Product not found"
        })
    }

    //does size for that product exist
    const selectedSize = product.sizes.find(s=>s.size === size);

    if(!selectedSize){
        return res.status(400).json({
            message:"Invalid size"
        })
    }

    // quantity for that stock exist
    if(selectedSize.stock<quantity){
        return res.status(400).json({
            message:"Insufficient stock"
        })
    }


    // let cart = await cartModel.findOne({user: req.user.userId});

    // if(!cart){
    //     cart = await cartModel.create({user: req.user.userId})
    // }

    const cart = (await cartModel.findOne({user: req.user.userId})) ?? await cartModel.create({user: req.user.userId})

}