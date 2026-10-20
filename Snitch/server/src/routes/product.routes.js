import {Router} from "express"
import {authenticate} from "../middlewares/auth.middleware.js"

const router = Router();


router.post("/",authenticate,(req,res,next)=>{

    if(req.user.role!=='seller'){
        return res.status(403).json({
            message:"user is not authorized to create products"
        })
    }
    next()
})



export default router