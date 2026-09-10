const mongoose=require('mongoose');
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:{
        type:String,
        minLength:[8,"Password must have at least 8 characters"],
        maxLength:[32,"Password cannot have more than 32 characters"],
        select:false,
    },
    googleId:{type:String},
    avatar:{type:String},
    accountVerified:{type:Boolean,default:false},
    verificationCode:Number,
    verificationCodeExpire:Date,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt:{type:Date, default:Date.now},
});

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password=await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
userSchema.methods.generateVerificationCode=function(){
    function generateFiveDigitNumber(){
        const firstDigit=Math.floor(Math.random()*9)+1
        const remainingDigits=Math.floor(Math.random()*10000).toString().padStart(4,0);
        return parseInt(firstDigit+remainingDigits);
    }
    const verificationCode=generateFiveDigitNumber();
    this.verificationCode=verificationCode;
    this.verificationCodeExpire=Date.now() + 5*60*1000;
    return verificationCode;
}
userSchema.methods.generateToken=async function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })

}

userSchema.methods.generateResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpire=Date.now()+15*60*1000;
    return resetToken;
}

const User=mongoose.model("User",userSchema);
module.exports=User;

