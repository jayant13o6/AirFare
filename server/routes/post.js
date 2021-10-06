import exp from "express"; 
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import auth from "../middleware/auth.js";
import { getPosts } from '../controllers/posts.js';
import Tickets from "../models/tickets.js";
import Flights from "../models/flight.js";
import Admin from "../models/admin.js";

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
    
    try{
        const userExsit = await User.findOne({email_id:req.body.email});
        if (userExsit){ 
            return res.status(422).json({error: 'email already exsit'});
            console.log('user already exsist')
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
        res.send()
          })
    .catch((err)=>{console.log(err)})
}}
    catch(err) {console.log(err)}
})


router.post('/login', async(req,res)=>{
    console.log(req.body)
    try{
        const adminLogin = await User.findOne({email_id:req.body.email})
            if (adminLogin) {
                console.log(adminLogin)
                const token = await adminLogin.createToken();
                console.log('token is :' + token)

                // cookies: res.cookie('name', value, [options])
                res.cookie('cookie2' , token, {
                expires: new Date(Date.now() + 1000*60*60*24),
                httpOnly: true
                    });
                res.send('logred success')
            }
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
    console.log('tickets data:', req.body)

    try{ const Ticket = new Tickets({
            source : req.body.source,
            destination : req.body.destination,
            departure_date : req.body.departure_date,
            arrival_date : req.body.arrival_date,
            total_pass : req.body.total_pass,
            email_id : req.body.email_id
    })
         Ticket.save()
         res.send('tickets booked, safe travel')
    }
    catch(err){console.log(err)}
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
            return res.status(422).json({error: 'email already exsit'});
            console.log('user already exsist')
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
                console.log('admin found:',adminLogin)
                const token = await adminLogin.createToken();
                console.log('token is :' + token)

                // cookies: res.cookie('name', value, [options])
                res.cookie('cookie2' , token, {
                expires: new Date(Date.now() + 1000*60*60*24),
                httpOnly: true
                    });
                res.send()
            }
            // else{res.render('invalid ccredantials')}
            else{
                console.log('invaltd credential')
                res.status(400).json({message:'invalid credantials'})
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

export default router;