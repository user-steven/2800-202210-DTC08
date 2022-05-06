const express = require('express');
const app = express()

const session = require("express-session")

app.set("view engine", "ejs")

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

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.render(__dirname+ "/public/index.ejs")
})

app.post("/", (req, res) => {
    if (req.body.logOut) {
        req.session.authenticated = false
        req.session.user = undefined
        res.render(__dirname+ "/public/index.ejs")
    } else if (users[req.body.loginEmail] == req.body.loginPass) {
        req.session.authenticated = true;
        req.session.user = req.body.loginEmail
        console.log("login sucessful");
        res.render(__dirname+ "/public/index.ejs")
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
        res.render(__dirname + "/public/login.ejs")
    } 
})

app.get("/signup", (req, res) => {
    if (req.session.authenticated) {
        res.redirect("/")
        console.log("already signed up");
    } else {
        res.render(__dirname + "/public/registration.ejs")
    }
})
