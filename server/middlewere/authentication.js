const jwt = require("jsonwebtoken");
const keySecret = "niteshnikkilouvashikhalwamduelshiej"
const userDB = require("../models/userSchema")

const authorization = async (req,res,next) => {
    try {
        const token = req.headers.authorization;

        const verifyToken = jwt.verify(token,keySecret)

        const rootUser = await userDB.findOne({_id:verifyToken._id})

        if(!rootUser){
            throw new Error ("User not found")
        }
        
        req.token = token
        req.verifyToken = verifyToken
        req.rootUser = rootUser

        next();

    } catch (error) {
        res.status(401).json({status:401,message:"Unauthorrized no token provide"})
    }
}

module.exports = authorization;