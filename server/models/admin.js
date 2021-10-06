import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const AdminSchema = mongoose.Schema({

    Username:{type: String, required: true},
    email_id:{type: String, required: true},
    password:{type: String, required: true},
    confirm_password:{type: String, required: true},
    phone_no:{type: Number, required: true},
    admin_id:{type: String, required: true},
    tokens:[{ token:{type: String, required:true}}]

}, {timestamps: true},);

AdminSchema.methods.createToken = async function(){
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


const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;