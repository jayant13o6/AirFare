import exp from "express"; 
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import auth from "../middleware/auth.js";
import { getPosts } from '../controllers/posts.js';
import Tickets from "../models/tickets.js";
import Flights from "../models/flight.js";
import Admin from "../models/admin.js";
import bcrypt from 'bcryptjs';
import { OAuth2Client } from "google-auth-library";
// import twilio from "twilio"; 
import Vonage from '@vonage/server-sdk';

const client1 = new OAuth2Client("630453011763-n2ecob2smr1j279kki66vf3ujdvovt55.apps.googleusercontent.com")
var router = exp();
var router = exp.Router();

router.use(cookieParser());

// router.get('/', getPosts);
router.get('/', (req,res)=> {
    res.send('machine working....')
})


// first time user entry : aka SIGNUP
router.post('/register', async (req,res) =>{
    console.log('data::',req.body);
    // res.send({"name": "jajammmmm", "email": "aajjmmmmm", "password": "knnnnn", "c_password": "pknnnn", "p_no": 8888888888});
    if (req.body.password !== req.body.c_password){
        return res.status(400).json({ error: 'password not matched'})
    }
    // if(req.body.email){return res.status(400).json({ error: 'password not matched'})}
    try{
        const userExsit = await User.findOne({email_id:req.body.email});
        if (userExsit){ 
            return res.status(422).json({error: 'email already exsit'});
            console.log('user already exsist')
        }
        if (req.body.password !== req.body.c_password){
            return res.status(400).json({ error: 'password not matched'})
        }
        else{
    // res.json({message: req.body})
        const user = new User({
        Username: req.body.name,
        email_id: req.body.email,
        password: req.body.password,
        confirm_password: req.body.c_password,
        phone_no: req.body.p_no,
    })

    // token created
    const token = await user.createToken();
    console.log('token is :' + token)
    
    // cookies: res.cookie('name', value, [options])
    res.cookie('cookie2' , token, {
        expires: new Date(Date.now() + 1000*60*60*24),     //expiry for a day
        httpOnly: true,
    })
    
    await user.save()
    .then((result)=>{
        console.log('result of register:',result)
        res.send('sing up success')
          })
    .catch((err)=>{console.log(err)})
}}
    catch(err) {console.log(err)}
})

router.post('/googleregister', async(req,res)=>{
    // console.log(req.body)
    const {tokenId} = req.body
    client1.verifyIdToken({idToken: tokenId, audience:'630453011763-n2ecob2smr1j279kki66vf3ujdvovt55.apps.googleusercontent.com'})
    .then(async(response)=>{
        // console.log(response)
        const {email_verified, name, email} = response.payload;
        console.log('payload:', response.payload)
        if (email_verified){
            let user = await User.findOne({email_id:email})
                // if (!user){return res.status(400).json({error:'something gone wrong'})}
                {
                    console.log('hello there')
                    if(user){const token = await user.createToken();
                        console.log('token is :' + token)
                        res.cookie('cookie2' , token, {
                            expires: new Date(Date.now() + 1000*60*60*24),     //expiry for a day
                            httpOnly: true,
                        }) 
                        res.send('login?')}
                    else{
                        let password = 'aaa'
                        let user = new User({name,email,password})
                        user.save((err,data) => {
                            if(err){console.log(err)}
                        })
                        res.send('signup?')
                    }
                }
            
        }else{console.log('mail not found')}
    })
    .catch((err)=>{console.log(err)})
})

router.post('/login', async (req,res)=>{
    console.log(req.body)
    try{
        const adminLogin = await User.findOne({email_id:req.body.email})
            if (adminLogin) {
                const isMatch = await bcrypt.compare(req.body.password, adminLogin.password)
                if (!isMatch){
                    // console.log(bcrypt('savve:',adminLogin.password))
                   return res.status(400).json({message:'invalid credantials dude'})
                }
                else{
                console.log(adminLogin)
                const token = await adminLogin.createToken();
                console.log('token is :' + token)

                // cookies: res.cookie('name', value, [options])
                res.cookie('cookie2' , token, {
                expires: new Date(Date.now() + 1000*60*60*24),
                httpOnly: true
                    });
                res.send('logred success')
            }}
            // else{res.render('invalid ccredantials')}
            else{
                // window.alert('invaltd credential')
                res.status(400).json({message:'invalid credantials'})
        }
    }
    catch(err){console.log(err)}
})


router.post('/book_ticket',auth, async (req,res)=>{
    // if (JsonWebTokenError){res.send('login required!!!!')}
    console.log('tickets data:', req.body,'source',req.body.source)
    const ticket = await Flights.findOne({source:req.body.source} && {destination:req.body.destination} && {flight_date:req.body.departure_date})
    if (ticket)
    {   console.log('ticket can be booked')
        try{ const Ticket = new Tickets({
            source : req.body.source,
            destination : req.body.destination,
            departure_date : req.body.departure_date,
            // arrival_date : req.body.arrival_date,
            total_pass : req.body.total_pass,
            email_id : req.body.email_id,
            total_cost: (req.body.total_pass*ticket.ticketCost)
    })
         Ticket.save()
         res.send('tickets booked, safe travel')
    }
    catch(err){console.log(err)}
}
    else{ console.log('ticket cant be booked')
        res.status(400).json({message:'ticket cant found'})}
})

router.get('/book_ticket', auth, async(req,res) => {
    console.log('person logged in to book their tickets:',req.userCheck.Username)
    res.send(req.userCheck.Username)
})

router.get('/history', auth, async(req,res) =>{
    Tickets.find({email_id: req.userCheck.email_id})
        .then((result)=>{
            res.send(result)
            console.log(result)
        })
        .catch((err)=>{console.log(err)})
})

router.post('/schedule_flight',auth, async(req,res)=>{
    console.log('flight details:',req.body)
    try{ const Flight = new Flights(req.body)
            Flight.save()
            res.send('schedule addede!!!')
    }
    catch(err){console.log(err)}
})

router.get('/logout', auth,async(req,res)=>{
    try {

        req.userCheck.tokens=[];
        console.log('trying to logout')
        res.clearCookie('cookie2') // clears the cookie
        res.send()
        console.log('logout successfully');
        
        await req.userCheck.save()
        // res.redirect('/');

    } catch (error) {
        // res.render(500).send(error)
        console.log(error);
    }
})


router.get('/adminlogout', auth,async(req,res)=>{
    try {
        console.log('tokens to clear:',req.adminCheck.tokens)
        req.adminCheck.tokens=[];
        console.log('trying to logout');
        res.clearCookie('cookie2') // clears the cookie
        console.log('logout successfully');

        await req.adminCheck.save()
        // res.redirect('/');

    } catch (error) {
        // res.render(500).send(error)
        console.log(error);
    }
})

router.post('/new_admin', async(req,res) =>{
    console.log('admin data:', req.body)
    try{
        const userExsit = await Admin.findOne({admin_id:req.body.adminId});
        if (userExsit){ 
            console.log('user already exsist')
            return res.status(422).json({error: 'email already exsit'});
        }
        else{
            const admin = new Admin({
                Username: req.body.name,
                email_id: req.body.email,
                password: req.body.password,
                confirm_password: req.body.c_password,
                phone_no: req.body.p_no,
                admin_id: req.body.adminId
            })

            // token created
            const token = await admin.createToken();
            console.log('token is :' + token)
            
            res.cookie('cookie2' , token, {
                expires: new Date(Date.now() + 1000*60*60*24),     //expiry for a day
                httpOnly: true,    })
    
            await admin.save()
            .then((result)=>{
                console.log('result of admin input:',result)
                res.send()    })
            .catch((err)=>{console.log(err)})
    }}
    catch(err){console.log(err)}
})

router.post('/admin', async(req,res)=>{
    console.log(req.body)
    try{
        const adminLogin = await Admin.findOne({admin_id: req.body.adminId})
            if (adminLogin) {

                // const isMatch = await compare(req.body.password, adminLogin.password)
                if (req.body.password != adminLogin.password){
                    // console.log(bcrypt('savve:',adminLogin.password))
                   return res.status(400).json({message:'invalid credantials dude'})
                }
                else{
                console.log('admin found:',adminLogin)
                const token = await adminLogin.createToken();
                console.log('token is :' + token)

                // cookies: res.cookie('name', value, [options])
                res.cookie('cookie2' , token, {
                expires: new Date(Date.now() + 1000*60*60*24),
                httpOnly: true
                    });
                res.send()
            }}
            // else{res.render('invalid ccredantials')}
            else{
                console.log('invaltd credential')
                return res.status(400).json({message:'invalid credantials'})
        }
    }
    catch(err){console.log(err)}
})

router.get('/indvUser', auth, async(req,res)=>{

    console.log('user logged in his personl acc')
    res.send(req.userCheck);

})

router.get('/schedule_flight', async(req,res)=>{
    Flights.find()
        .then((result)=>{
            console.log(result)
            res.send(result)
        })
        .catch((err)=>{console.log(err)})
})


router.get('/indvAdmin', auth, async(req,res)=>{
    console.log('user logged in his personl acc')
    res.send(req.userCheck);
})

router.delete('/schedule_flight/:id', async(req,res)=>{
    console.log('delete:', req.body,req.params)
    Flights.findByIdAndDelete(req.params.id)
    .then((result)=>{
        res.json('delete method used')
        console.log('deleted')
    })
    .catch((err)=>{console.log(err)})    
    // res.redirect('/admin')
})

router.post('/searchDestination', async(req,res)=>{
    console.log(req.body,req.body.search)
    Flights.find({destination : req.body.search})
    .then((result)=>{
        console.log(result)
        res.send("flight data found")
        // res.json(result)
    })
    .catch((err)=>{console.log(err)})
})

router.post('/otpSend', async(req,res)=>{
    console.log('otp:', req.body)  
    // var client = new twilio("ACe77315c21791ae4262d40f0f8ea5326d","70bcae7bd619fab4c9f846ad5ac3d5fb")

    // client.messages.create({
    //     from: '+12055573461',
    //     to: '+918766339773',
    //     body: req.body.num+"sent by jayant"
    // }).then((result)=>{
    //     console.log("message sent")
    //     res.send(result)
    // })
    // .catch((err)=>{console.log(err)})

    //////////new api used
    apiKey = Process.env.vonageapiKey
    apiSecret = Process.env.vonageapiSecret
    const vonage = new Vonage({ apiKey, apiSecret})

    const from = "Vonage APIs"
    const to = "919599097305"
    const text = req.body.num+'A text message sent using the Vonage SMS API'

    vonage.message.sendSms(from, to, text,(err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
                res.status(200).json({message:'validd credantials dude'})
            }
            else { console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
    }
})//.then((result)=>{res.send(result)})
// .catch((err)=>{console.log(err)})
})

// router.post('/payment', (req,res) =>{res.send('nice work')})
export default router;