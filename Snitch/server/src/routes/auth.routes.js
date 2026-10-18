import {Router} from "express"
import {registerValidator,loginValidator} from "../validator/auth.validator.js"
import {register,login,refresh,getMe} from "../controller/auth.controller.js"
import { authencticate } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";


const router = Router();


router.post("/register",registerValidator,register);

router.post("/login",loginValidator,login);

router.post("/refresh",refresh);

router.get("/me",authencticate,getMe)

export default router