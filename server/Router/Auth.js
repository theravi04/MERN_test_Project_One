const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

require("../DB/Connection");
const User = require("../Models/UserSchema");

router.get("/", (req, res) => {
  res.send(`hello world from router`);
});

//used the below code to get data from postman
router.post("/register", async (req, res) => {

  const { name, email, phone, work, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !work || !password || !confirmPassword) {
    return res.status(422).json({ error: "Data missing" });
    // (422) : unrocessable content
    // The request was well-formed but was unable to be followed due to semantic errors.
  }

  try {

    const UserPresent = await User.findOne({ email: email });

    if (UserPresent) {
        return res.status(422).json({ error: "User already present" });
    } 
    else if(password != confirmPassword){
      return res.status(422).json({ error: "password not matching" });
    } 
    else{
      const user = new User({name,email,phone,work,password,confirmPassword});
      // before save we have used hashing for critical data
      // done hashing in userSchema
      await user.save();
      res.status(201).json({message:"User registered successfully"}); 
      // (201) : The request succeeded, and a new resource was created as a result.
      // This is typically the response sent after POST requests, or some PUT requests.
    }

    

  } catch (err) {
    console.log(err);
  }

});



//login route

router.post('/signin', async (req,res) =>{

    try {

      //object destructuring
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({error:"Incomplete Credentials"});
            // (400) : bad request
            // The server cannot or will not process the request due to something that is perceived to be a client error
            // (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
        }

        //reading data from DB
        const userLogin = await User.findOne({ email: email });
        // console.log(userLogin);

        if(userLogin){
          const isMatch = await bcrypt.compare(password, userLogin.password);

          const token = await userLogin.generateAuthToken();
          console.log(token);

          if(!isMatch){
            //here error for password
            res.status(400).json({error:"Invalid Credentials"});
          } else{
            res.json({message:"User signin Successful"});
          }
        }
        else{
          res.status(400).json({error:"Invalid Credentials"});
        }


    } catch (err) {
        console.log(err);
    }
});

module.exports = router;














//example of above
// console.log(name);
// console.log(email);

// console.log(req.body);
//console.log(req.body.name);
// const user = new User(req.body);
//destructuring
// const user = new USER({
// name:req.body.name
// })
//
// user.save();

// res.json({ message: "Data inserted successfully" });
// res.json({message:req.body});
// res.send("to register page");


//WITHOUT ASYNC AWAIT
/*
//used the below code to get data from postman
router.post("/register", (req, res) => {
  const { name, email, phone, work, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !work || !password || !confirmPassword) {
    return res.status(422).json({ error: "Data missing" });
  }

  User.findOne({ email: email })
    .then((UserPresent) => {

        if (UserPresent) {
            return res.status(422).json({ error: "Email already present" });
        }
        const user = new User({name,email,phone,work,password,confirmPassword,
        });
            user.save().then(()=>{
                res.status(201).json({message:"done successfully"})
            //error from database
            }).catch((err) => res.status(500).json({error:"Failed to register"}))
    //if .then doesn't work
    }).catch(err => {console.log(err);});
});
*/
