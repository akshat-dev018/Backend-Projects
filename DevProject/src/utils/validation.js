const validator = require("validator");
const { body, validationResult } = require("express-validator");

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} = req.body

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }

    else if(firstName.length<4 || firstName.length>50){
        throw new Error("First Name should be 4-50 charaters");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
}

const validateLoginData = (req)=>{
      
    const { emailId, password } = req.body;

    if(!validator.isEmail(emailId)){
         throw new Error("Email is not valid");
    }

        if(!password){
            throw new Error("Password is required")
        }
    
}

const validateEditProfileData = [

    // Check allowed fields
    (req, res, next) => {

        const allowedEditFields = [
            "firstName",
            "lastName",
            "emailId",
            "age",
            "gender",
            "photoUrl",
            "about",
            "skills"
        ];

        const isEditAllowed = Object.keys(req.body).every(
            (field) => allowedEditFields.includes(field)
        );

        if (!isEditAllowed) {
            return res.status(400).json({
                message: "Invalid fields in edit request"
            });
        }

        next();
    },

    body("firstName")
        .isString().withMessage("First name must be a string")
        .bail()
        .trim()
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters"),

    body("lastName")
        .isString().withMessage("Last name must be a string")
        .bail()
        .trim()
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters"),

    body("emailId")
        .isString().withMessage("EmailId must be a string")
        .optional()
        .isEmail().withMessage("Invalid email address"),

    body("age")
        .isInt({ min: 18, max: 100 })
        .optional()
        .withMessage("Age must be between 18 and 100"),

    body("gender")
        .isIn(["male", "female", "other"])
        .optional()
        .withMessage("Invalid gender"),

    body("photoUrl")
        .optional()
        .isURL().withMessage("Invalid photo URL"),

    body("about")
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage("About cannot exceed 500 characters"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array"),

    body("skills.*")
        .isString()
        .withMessage("Each skill must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Skill cannot be empty"),

    // Check validation errors
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid profile data",
                errors: errors.array()
            });
        }

        next();
    }
];

const validateEditPassword = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .bail()
        .isStrongPassword()
        .withMessage("Password must contain uppercase, lowercase, number and special character"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData,
    validateEditPassword
}