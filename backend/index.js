const express = require('express');
const app =express();

const mongoose= require('mongoose');
app.use(express.json())

const cors =require("cors");
app.use(cors());

const bcrypt=require("bcryptjs");
const jwt= require("jsonwebtoken")
const dotenv = require("dotenv")


dotenv.config()


const JWT_SECRET="hdjdbserwurjsj142!@#%6%*gsydtgd+$dsyy351371878"


// const mongoUrl="mongodb+srv://ankitgupta06062002:Samyak12345@cluster0.607aybj.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(process.env.mongoUrl,{
    useNewUrlParser:true
}).then(()=>{
    console.log("Connected to database");
}).catch(e=>console.log(e))

require("./userDetails")
const User=mongoose.model("UserInfo");



app.post("/register",async(req,res)=>{
    const{fname,lname,email,password}=req.body;

    const encryptedPassword=await bcrypt.hash(password,10)
    try{
        const oldUser= await User.findOne({email});
        if(oldUser){
          return  res.send({error:"User Exist"})
        }

      await User.create({
        fname,lname,email,password:encryptedPassword,
      })
      res.send({status:"ok"})
    }catch(error){

        res.send({status:"error"})

    }
})

app.post("/login-user",async(req,res)=>{
    const {email,password}=req.body;

    const user= await User.findOne({email});
    if(!user){
        return res.json({error:"Üser Not Found"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign({email:user.email},JWT_SECRET);

        if(res.status(201)){
            return res.json({status:"ok",data:token});
        }
        else{
            return res.json({error:"error"});
        }
    }

    res.json({status:"error",error:"INvalid Password"})
})

app.post("/userData",async(req,res)=>{
    const {token}=req.body;
    try{
        const user=jwt.verify(token,JWT_SECRET);
        const useremail=user.email;
        User.findOne({email:useremail}).then((data)=>{
            res.send({status:"ok",data: data})
        }).catch((error)=>{
            res.send({status:"error",data:error});
        });

        }

    
    catch(error){

    }

});








app.listen(process.env.PORT,()=>{
    console.log("Server Started");
})