// generally we use "use" to write middleware
// handle all Auth Middleware req (get,post,patch,delete)
const adminAuth = (req,res,next)=>{
    console.log("ADMIN AUTH IS GETTING CHECKED!!");
    const token ="xyz";
    const isAuthorized = token === "xyz";

    if(!isAuthorized){
    res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}

const userAuth = (req,res,next)=>{
    console.log("USER AUTH IS GETTING CHECKED!!");
    const token ="xyz";
    const isAuthorized = token === "xyz";

    if(!isAuthorized){
    res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}


module.exports = {
    adminAuth,userAuth
}