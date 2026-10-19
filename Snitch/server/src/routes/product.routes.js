import {Router} from "express"
import { createProductValidator } from "../validator/product.validator.js";

const router = Router();


router.post("/products",createProductValidator)



export default router