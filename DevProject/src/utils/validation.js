const validator = require("validator");

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

module.exports = {
    validateSignUpData,validateLoginData
}