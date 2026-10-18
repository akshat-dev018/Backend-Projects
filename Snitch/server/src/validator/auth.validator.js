import {body, validationResult} from "express-validator"


export const registerValidator = [
    body('email')
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter valid email address"),

    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string")
        .trim()
        .isLength({min:2, max:50}).withMessage("Name length must be between 2 to 50 charaters "),

    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string")
        .trim()
        .isLength({min:6}).withMessage("Password must be minimum 6 character long"),

    (req,res,next)=>{
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"Invalid request ",
                errors:errors.array()
            })
        }

        next();

    }
]

export const loginValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .isString().withMessage("Email must be a string value").bail()
        .trim()
        .isEmail().withMessage("Enter a valid email adddress"),

    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be string").bail()
        .trim()
        .isLength({min:6}).withMessage("Password atleast 6 character long"),

        (req,res,next)=>{
            const errors = validationResult(req);

            if(!errors.isEmpty){
                return res.status(400).json({
                    message:"Invalid data",
                    errors:errors.array()
                })
            }

            next();

        }
]

// bail check ki agr email validation fail hua toh aage ke email validations 
// check hi nhi honge hum name validation pe chle jayenge