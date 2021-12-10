import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import Admin from '../models/admin.js';


export const auth2 = async(req,res)=>{
    try {
        const token = req.cookies.cookie2;
        const verifyUser = jwt.verify(token,'verystrongsecrettokeep');
        // console.log('info1:',verifyUser);
        
        // const userCheck = await User.findOne({_id:verifyUser._id})
        const adminCheck = await Admin.findOne({_id:verifyUser._id})
        // if (!userCheck){ 
            if (!adminCheck){throw new Error('user/admin not found by auth')}
            else{
                console.log('info by auth:',adminCheck.Username);
                req.adminCheck = adminCheck;
                req.token = token;
                next()
            }            
        
        // else{// console.log('info2:',userCheck);
        // console.log('info3:', userCheck.Username);
        // req.userCheck = userCheck;
        // req.token = token;
        // next();
        
    } catch (error) {
        res.send('unauthorized access')
        console.log(error)
    }
}



const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.cookie2;
        const verifyUser = jwt.verify(token,'verystrongsecrettokeep');
        // console.log('info1:',verifyUser);
        
        const userCheck = await User.findOne({_id:verifyUser._id})
        // const adminCheck = await Admin.findOne({_id:verifyUser._id})
        if (!userCheck){ 
            // if (!adminCheck){throw new Error('user/admin not found by auth')}
            // else{
            //     console.log('info by auth:',adminCheck.Username);
            //     req.adminCheck = adminCheck;
            //     req.token = token;
            //     next()
            // }            
        }
        else{// console.log('info2:',userCheck);
        console.log('info3:', userCheck.Username);
        req.userCheck = userCheck;
        req.token = token;
        next();
        }
    } catch (error) {
        res.send('unauthorized access')
        console.log(error)
    }
}

export default auth;
