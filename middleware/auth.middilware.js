import jwt from "jsonwebtoken";

export const isloggedIn = (req, res, next)=>{

    try {
        console.log("hfhfhhf",req.cookies);
        const token = req.cookies?.test;
        console.log("tOKEN FOUND", token? "yes": "No");
        if(!token){
            console.log("Token not found");
            return res.status(401).json({
                success: false,
                message: "Access Denied, Please login"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded", decoded);
        req.user = decoded;
        console.log("User", req.user);

        next();
        

         
    } catch (error) {
        console.log("Error in auth middleware", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })   
    }
};
