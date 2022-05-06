const express = require('express');
const app = express()

const session = require("express-session")

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}))

app.use(session({
    secret: "dtc8",
    saveUnintialized: true,
    resave: true
}))

app.listen(5100, function(err){
    if(err) console.log(err);
    })

const users = {
    "superUser@dtc8.ca" : "super",
    "testUser@dtc8.ca" : "test"
}

var user_data = [{email: 'admin@bcit.ca', password: 'bcit', admin: true}]

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/public/index.html")
})

app.post("/", (req, res) => {
    if (users[req.body.loginEmail] == req.body.loginPass) {
        req.session.authenticated = true;
        req.session.user = req.body.loginEmail
        console.log("login sucessful");
        res.sendFile(__dirname+ "/public/index.html")
    } else {
        console.log("wrong credentials");
        res.redirect("/login")
    }
})

app.get("/login", (req, res) => {
    if (req.session.authenticated) {
        res.redirect("/")
        console.log("already have a session");
    } else {
        res.sendFile(__dirname + "/public/login.html")
    } 
})

app.get("/signup", (req, res) => {
    if (req.session.authenticated) {
        res.redirect("/")
        console.log("already signed up");
    } else {
        res.sendFile(__dirname + "/public/registration.html")
    }
})


app.post("/create_user", function (req, res) {
    registerInfo = req.body
    registerInfo["admin"] = false
    user_data.push(registerInfo)
    // console.log(registerInfo)
    // console.log(user_data)
    console.log("Registered")
    return res.redirect("/login")
})