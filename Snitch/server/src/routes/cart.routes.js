import {Router} from "express"
import { addToCartValidator } from "../validator/cart.validator.js";
import {authenticate} from "../middlewares/auth.middleware.js";
import { addToCart, getCart } from "../controller/cart.controller.js";

const router = Router();

router.post("/",authenticate,addToCartValidator,addToCart);
router.get("/",authenticate,getCart)

export default router