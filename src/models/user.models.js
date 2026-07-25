const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required to Create an Account"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    unique: [true, "Email Already Exists"]
  },
  name: {
    type: String,
    required: [true, "Name is Required to create an Account"],

  },
  password: {
    type: String,
    required: [true, "Password is Required for creating an Account"],
    minlength: [6, "Password should atleast contain 6 characters"],
    select: false //whenever we need to req user details.. password will not be sent wil we ask for it specifically
  },
  systemUser: {
    type: Boolean,
    default: false,
    immutable: true,
    select: false
  }
}, {
    timestamps: true //we'll get timiestamps like when user created, updated etc
});

userSchema.pre("save", async function(){

    if(!this.isModified("password")){
        return next()
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return 

})

userSchema.methods.comparePassword = async function(password){
  console.log(password, this.password )
  return await bcrypt.compare(password, this.password)

}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
