const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({path:'./config.env'});
require('./DB/Connection');

app.use(express.json());

// const User = require('./Models/UserSchema');

const PORT = process.env.PORT;

app.listen(PORT, () =>{
    console.log(`server running on ${PORT}`);
})

app.use(require('./Router/Auth'));

// app.get('/', (req,res)=>{
//     res.send(`hello world`);
// });

//middleware
const middleware = (req,res,next)=>{
    console.log(`Hello my middleware`);
    next(); 
}

app.get('/about',middleware, (req,res)=>{
    res.send(`hello world from about`);
});

app.get('/contact', (req,res)=>{
    res.send(`hello world from contact`);
});

// app.get('/signin', (req,res)=>{
//     res.send(`hello world from signin`);
// });

// app.get('/signup', (req,res)=>{
//     res.send(`hello world from signup`);
// });



