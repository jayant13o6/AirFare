import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = mongoose.Schema({

    Username:{type: String, required: true},
    email_id:{type: String, required: true},
    password:{type: String, required: true},
    confirm_password:{type: String, required: true},
    phone_no:{type: String, required: true},
    tokens:[{ token:{type: String, required:true}}]

}, {timestamps: true},);


// hashing password
UserSchema.pre('save', async function(next){
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.confirm_password = await bcrypt.hash(this.confirm_password, 12);
    }
    next();
});

UserSchema.methods.createToken = async function(){
    try{
        // const token = jwt.sign({Username:this.Username},"verystrongsecrettokeep")
        // users.tokens = token.toString()
        console.log(this._id)
        const tokenx = jwt.sign({_id:this._id},"verystrongsecrettokeep")
        console.log(tokenx)
        this.tokens= this.tokens.concat({token:tokenx.toString()})
        await this.save();
        return tokenx;
    }
    catch(error){console.log(error);}
}

const User = mongoose.model('User', UserSchema);
export default User;
