const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/userDB');
app.use(express.static("public"));//to put css stylesheet
var userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret=" long little secret";
userSchema.plugin(encrypt, { secret:secret,encryptedFields: ["password"] });
const User= new mongoose.model("User",userSchema);
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register",function(req,res)
{
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err)
  {if(err)
      console.log(err);
  else  res.render("secrets")}
);
})
app.post("/login",function(req,res)
{
  const username= req.body.username;
  const password= req.body.password
  User.findOne({email:username},function(err,foundUser){
    console.log("it is insode");
    if(err){
         console.log(err);
        }
    else {
      if (foundUser){
       if(foundUser.password === password){
         res.render("secrets");
       }
     }
   }
 });
});



app.listen(3002, function(req, res) {
  console.log("server started at 3002")
});
