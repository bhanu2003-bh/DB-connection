const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {UserDatabase,TodoDatabase} = require('./db');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const {z} = require('zod');

//connect to db
mongoose.connect('')
.catch((error)=>{
console.log(error);
})

//Variables
const port = 3000
const JWT_SECRET_KEY = "KILL ME"

//Midddleware
app.use(express.json());
app.use(cors());


//function
function auth(req,res,next){
const token = req.body.token;

    try{

     const result = jwt.verify(token,JWT_SECRET_KEY);
      req.id = result.ID;
      next();
    }
    catch(error){
        res.status(401).json({
            "message" : "Unthorized User. Error:"+error
        })
    }

}

//Routes
app.post('/signup',async (req,res)=>{

//validation
const reqestbody = z.object({
    email : z.string().min(3).max(100).email(),
    password : z.string().min(3).max(100),
    name : z.string().min(2)
})

const result = reqestbody.safeParse(req.body);

if(!result.success){
    res.json({
        "message" : "Wrong Inputs"
    })
    return;
}

const email = req.body.email;
const password = req.body.password;
const hashpassword = await bcrypt.hash(password,5);
const name = req.body.name;

console.log("HashPassword:"+hashpassword);

try {
    const result = await UserDatabase.create({
    "email" : email,
    "password" : hashpassword,
    "name" : name
    })
    
    console.log(result);

    res.status(200).json({
        "message" : "SuccessFully Register."
    })

} catch (error) {
    console.log("Error:"+error);
    res.status(400).json({
        "message" : "DataBase may be Down or Email is already Register. Error:" + Error
    })
}

})

app.post('/signin',async (req,res)=>{
    

const email = req.body.email;
const password = req.body.password;

try {
    const result = await UserDatabase.findOne({
    "email" : email,
    })

    const poperresult =  await bcrypt.compare(password,result.password);
    console.log("Result:"+result);

    if(poperresult){
    const token =  jwt.sign({
        "ID" : result._id
     },JWT_SECRET_KEY);   


    res.status(200).json({
        "message" : "SuccessFully Register.",
        "token" : token
    })
   }
   else{
      res.status(403).json({
          "message" : "Invaild Cred."
      })
   }

} catch (error) {
    res.status(500).json({
        "message" : "DataBase may be Down. Error:" + Error
    })
}

})

app.post('/addtodo',auth,(req,res)=>{
    res.status(200).json({
        "message" : req.id
    });
})

app.get('/getalltodo', auth,(req, res) => res.status(200).json({"message" : req.id}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
