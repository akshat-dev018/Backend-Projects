import {Router} from "express"
import { addToCartValidator } from "../validator/cart.validator.js";
import {authenticate} from "../middlewares/auth.middleware.js"

const router = Router();



router.post("/",authenticate,addToCartValidator)

export default router