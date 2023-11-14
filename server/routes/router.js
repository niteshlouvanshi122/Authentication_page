const express = require("express");
const router = new express.Router();
const userDB = require("../models/userSchema")
const bcrypt = require("bcryptjs")
const authorization = require("../middlewere/authentication")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const keySecret = process.env.JWT_SECRETKEY


// Emai config 
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWD
    }
})



// user Registetion
router.post("/register",async(req,res)=>{
    
    const {fname,email,password,cpassword} = req.body;

    if(!fname || !email || !password || !cpassword){
        res.status(422).json({error:"fill the all details"})
    }
    try {
        
        const preUser = await userDB.findOne({email:email});

        if(preUser){
            res.status(422).json({error:"This Email is Already Exist"})
        }
        else if (password !== cpassword){
            res.status(422).json({error:"Password and comfirm password Not Match"})
        }else{
            const finalUser = new userDB({
                fname,email,password,cpassword
            })

            // here password hasing

            const storeData = await finalUser.save()
            // console.log(storeData);
            res.status(201).json({status:201,storeData})
        }

    } catch (error) {
        res.status(422).json(error)
        console.log("catch block error");
    }

});

// user Login
router.post("/login",async(req,res)=>{
    // console.log(req.body);
    const {email, password} = req.body;
    if(!email || !password){
        res.status(422).json({error:"fill the all details"})
    }

    try {  
        const userValid = await userDB.findOne({email});
    
        if(userValid){
            const isMatch = await bcrypt.compare(password,userValid.password)
    
            if (!isMatch){
                res.status(422).json({error:"Invalid Details"})
            }else{
                
                // token Generate
                const token = await userValid.generateAuthtoken();

                // console.log(token);

                // generate Cookie
                res.cookie("userCookie",token,{
                    expires: new Date(Date.now()+9000000),
                    httpOnly:true
                })

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);
        console.log("catch block");
    }
 
})

// user valid
router.get("/validuser",authorization, async (req, res) => {
    try {
        const ValidUserOne = await userDB.findOne({_id: req.rootUser})
        res.status(201).json({status:201,ValidUserOne})
    } catch (error) {
        res.status(401).json({status:401,error})
    }
})

// user logout
router.get("/logout", authorization, async (req,res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((cureIlem)=>{
            return cureIlem.token !== req.token
        })
        res.clearCookie("userCookie",{path:"/"})
    
        req.rootUser.save();
    
        res.status(201).json({status:201})
    
    } catch (error) {
        res.status(401).json({status:401,error})
    }
})

// send email link for Reset password
router.post("/sendpasswordlink", async (req,res) => {
    // console.log(req.body);

    const {email} = req.body

    if(!email){
        res.status(401).json({error:"Enter Your Email"})
    }

    try {
        const userFind = await userDB.findOne({email})

        
        // token genret for Reset password
        const token = jwt.sign({id:userFind._id},keySecret,{
            expiresIn:"120s"
        })
        const setusertoken = await userDB.findByIdAndUpdate({_id:userFind._id},{verifytoken:token},{new:true})
        
        if(setusertoken){

            const maileOptions = {
                from:"niteshlovanshi109@gmail.com",
                to:email,
                subject:"Sending Email for Password Reset",
                text:`This Link valid for 2 min http://localhost:3000/forgotpassword/${userFind.id}/${setusertoken.verifytoken}`
            }

            transporter.sendMail(maileOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.status(401).json({status:401,message:"email not send"})
                }else{
                    console.log("Email sent",info.response);
                    res.status(201).json({status:201,message:"Email send Succsfully"})
                }
            })
        }
    } catch (error) {
        res.status(401).json({status:401,message:"Invalid User"})
    }
})

// verify user for forgot password time 
router.get("/forgotpassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params
    
    try {
        const validUser = await userDB.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keySecret);
        // console.log(verifyToken)

        if (validUser && verifyToken){
            res.status(201).json({status:201,validUser})
        }else{
            res.status(401).json({status:401,message:"user not exist"})
        }

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})

router.post("/:id/:token",async(req,res)=>{
    const {password} = req.body
    const {id,token} = req.params

    try {
        const validUser = await userDB.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keySecret);

        if (validUser && verifyToken){

            const newPassword = await bcrypt.hash(password,12)

            const setnewPassword = await userDB.findByIdAndUpdate({_id:id},{password:newPassword})

            setnewPassword.save()

            res.status(201).json({status:201,validUser})
        }else{
            res.status(401).json({status:401,setnewPassword})
        }

    } catch (error) {
        res.status(401).json({status:401,error})
    }

})


module.exports = router;