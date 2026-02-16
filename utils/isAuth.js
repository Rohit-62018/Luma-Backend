const jwt = require('jsonwebtoken');

module.exports.isAuth = (req,res,next)=>{
    const token = req?.cookies.token;
    if (!token) {
        return res.status(403).json({ message: "Unauthorized access", success: false });
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        next()
    }catch(error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired", success: false });
        }
        return res.status(403).json({ message: "Invalid token", success: false });
    }
}