const tokenBlacklistModel = require("../models/blacklist.model")
const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")


async function authMiddleware(req, res, next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ] //check if the token is not there in the cookies or Header...

    if (!token){
        return res.status(401).json({
            message: "Unathorized access, Token in missing"

            
        })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token})

    if (isBlacklisted){
        return res.status(401).json({
            message: "Unauthorized Access, Token is Invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await userModel.findById(decoded.userId)
        req.user = user
        return next()

    } catch(err){
        return res.status(401).json({
            message: "Unathorized Access, Token is Invalid"
        })
    }
}

async function authSystemUserMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if(!token){
        return res.status(401).json({
            message: "Unathorised access, token is missing"
        })
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token})

    if (isBlacklisted){
        return res.status(401).json({
            message: "Unauthorized Access, Token is Invalid"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden Access, not a System User"
            })
        }
        req.user = user
        return next()
    }
    catch(err){
        return res.status(401).json({
            message: "Unathorized Accerss, token is invalid"
        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}