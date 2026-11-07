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


    const cart = (await cartModel.findOne({user: req.user.userId})) ?? await cartModel.create({user: req.user.userId});

    const productInCart = cart.products.find(p=>(p.product.toString()===productId) && (p.size===size));
    // we are comparing mongoose id of that product 

    if(productInCart){
        // Case1:quantity exceed the stock
        if((productInCart.quantity+quantity)>selectedSize.stock){
            return res.status(400).json({
                message:"Insufficient Stock",
            })
        }

        await cartModel.updateOne(
            {
                user: req.user.userId,
                "products.product":productId,
                "products.size":size,
            },
            {
                $inc:{
                    "products.$.quantity":quantity
                }
            }
        )
            return res.status(200).json({
                message:"Product quantity updated in cart"
            })

    }

    await cartModel.findOneAndUpdate({
        user:req.user.userId,
    },{
        $push:{
            products:{
                product:productId,
                quantity:quantity,
                size:size
            }
        }
    })

    return res.status(200).json({
        message:"Product added to cart"
    })

}


export async function getCart(req,res) {
    const cart = (await cartModel.findOne({user:req.user.userId})) 
    ?? (await cartModel.create({user:req.user.userId}))

    return res.status(200).json({
        message:"Cart retrive successfully",
        data:{
            cart:cart
        }
    })
}