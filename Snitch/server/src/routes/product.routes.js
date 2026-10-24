import {Router} from "express"
import {authenticate} from "../middlewares/auth.middleware.js"
import multer from "multer"
import { createProductValidator } from "../validator/product.validator.js";
import { createProduct, listAllProducts } from "../controller/product.controller.js";

const router = Router();

const upload = multer({storage:multer.memoryStorage(),
    limits:{
        files:5,
        fileSize: 1*1024*1024 //1mb
    },
// fileFilter: to accept files of specific type like images,audio,video,pdf..etc
});

router.post("/",authenticate,(req,res,next)=>{

    // check the role is seller
    if(req.user.role!=='seller'){
        return res.status(403).json({
            message:"user is not authorized to create products"
        })
    }

        next();

    },
// required for reading data from req.body if the format is form-data(multipart-form data)
    upload.array("images"),
    // parse the complex data like obj and arr into json
    (req,res,next)=>{
        req.body?.price && (req.body.price = JSON.parse(req.body.price));
        req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
            next();
    },
    createProductValidator,
    // create product
    createProduct)


router.get("/",authenticate,listAllProducts)    

export default router