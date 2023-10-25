const mongoose = require ("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keySecret = "niteshnikkilouvashikhalwamduelshiej"

const UserSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    cpassword:{
        type:String,
        required:true,
        minlength:6,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    verifytoken:{
        type:String,
    },
})

// hash password
UserSchema.pre("save", async function(next){
    
    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }

    next()
})

// token Generate
UserSchema.methods.generateAuthtoken = async function(){
    try {
        let token1 = jwt.sign({_id:this._id},keySecret,{
            expiresIn:"1d"
        });
        this.tokens = this.tokens.concat({token:token1})
        await this.save()
        return token1
    } catch (error) {
        res.status(422).json(error)
    }
}

// create model
const userDB = new mongoose.model("user",UserSchema);

module.exports = userDB;