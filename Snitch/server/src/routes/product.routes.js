import {Router} from "express"
import {authenticate, authenticateSeller} from "../middlewares/auth.middleware.js"
import multer from "multer"
import { createProductValidator, unlistProductValidator, listProductValidator } from "../validator/product.validator.js";
import { createProduct, listAllProducts, unlistProduct, listProduct, listAllProductsToSeller } from "../controller/product.controller.js";

const router = Router();

const upload = multer({storage:multer.memoryStorage(),
    limits:{
        files:5,
        fileSize: 1*1024*1024 //1mb
    },
// fileFilter: to accept files of specific type like images,audio,video,pdf..etc
});

router.post("/",authenticate,authenticateSeller,
    
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

router.patch("/unlist/:id",authenticate, authenticateSeller, unlistProductValidator, unlistProduct);


router.patch("/list/:id",authenticate, authenticateSeller, listProductValidator, listProduct);


router.get("/seller",authenticate, authenticateSeller, listAllProductsToSeller)

export default router