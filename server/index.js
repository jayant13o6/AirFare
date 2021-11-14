import dotenv from 'dotenv';
import express from 'express';             //for template
// import bodyParser from 'body-parser';       // for making get/post req
import mongoose from 'mongoose';            // for database
import cors from 'cors';                    // for req b/w pages
import postRoutes from './routes/post.js';

const app = express();
app.use(express.urlencoded({extended: true}));
// app.use(bodyParser.json({extended:true}));
// app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

dotenv.config({ path: './config.env'});
const connectURL = process.env.DATABASE;
const Port = process.env.Port || 8000;

mongoose.connect(connectURL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => app.listen(Port, ()=>{console.log('we start express and Mongodb connected')}))  //listen for request
.catch(err => console.log(err));


app.get('/',postRoutes);

app.post('/register',postRoutes);

app.post('/login',postRoutes);

app.post('/book_ticket', postRoutes);

app.get('/book_ticket', postRoutes);

app.post('/schedule_flight', postRoutes);

app.get('/schedule_flight', postRoutes);

app.get('/login',postRoutes);

app.get('/logout',postRoutes);

app.post('/new_admin',postRoutes);

app.post('/admin', postRoutes);

app.get('/indvUser', postRoutes);

app.get('/indvAdmin', postRoutes);

app.get('/adminlogout', postRoutes);

app.get('/history', postRoutes);

app.post('/googleregister',postRoutes);

app.delete('/schedule_flight/:id', postRoutes);

app.post('/searchDestination', postRoutes);

app.post('/otpSend', postRoutes);