//jshint esversion:6
//////dotenv module configuration
// require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// var md5 = require('md5');


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

///////dotenv module encryptionKey///////
// const encKey = process.env.ENC_KEY;
// const sigKey = process.env.SIG_KEY;
//
// userSchema.plugin(encrypt, {encryptionKey :encKey , signingKey :sigKey, encryptedFields : ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home")
});

app.get("/register", function(req, res) {
  res.render("register")
});

app.get("/secrtes", function(req, res) {
  res.render("secrets")
});

app.get("/login", function(req, res) {
  res.render("login");
});


/////////////////////Hashing using MD5/////////////////////
// app.post("/register", function(req, res){
//   const user = new User({
//     email : req.body.username,
//     password : md5(req.body.password)
//   })
//   user.save(function(err){
//     if(!err){
//       console.log("Data Inserted succesfully");
//     }else{
//       log(err)
//     }
//   })
//  res.render("home");
// });

// app.post("/login", function(req, res){
//   const username = req.body.username;
//   const passcode = md5(req.body.password);
//
//   User.findOne({email :username }, function(err, foundresult){
//     if(foundresult.email === username){
//       if(foundresult.password===passcode){
//         res.render("secrets")
//       }else{
//         console.log(err);
//       }
//     }
//   })
// });


//////Hashing salting using bcrypt////////////
app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const user = new User({
      email: req.body.username,
      password: hash
    })
    user.save(function(err) {
      if (!err) {
        console.log("Data Inserted succesfully");
      } else {
        log(err)
      }
    })
  });
  res.render("home");
});

app.post("/login", function(req, res) {

  const username = req.body.username;
  const passcode = req.body.password;

  User.findOne({email: username}, function(err, foundresult) {
    if (foundresult.email === username) {
      bcrypt.compare(passcode, foundresult.password, function(err, result) {
        if (result === true) {
          res.render("secrets")
        } else {
          console.log(err);
        }
      });
    }
  })
});


app.listen(3000, function(req, res) {
  console.log("server running on port 3000")
});
