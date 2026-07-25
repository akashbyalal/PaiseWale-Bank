const mongoose = require("mongoose")

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to Blacklist"],
        unique: [true, "Token already Balaklisted"]
    },
    
}, {
    timestamps: true
})

tokenBlacklistSchema.index({createdAt: 1},{
    expireAfterSeconds: 60 * 60 * 24 * 3 //three days
})

const tokenBlacklistModel = mongoose.model("tokenBlacklist",tokenBlacklistSchema)

module.exports = tokenBlacklistModel