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

var user_data = [{email: 'admin@bcit.ca', password: 'bcit', admin: true}]

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.render(__dirname+ "/public/index.ejs")
})

app.post("/", (req, res) => {
    let user = false
    let userIndex = 0
    for (i=0; i < user_data.length; i++) {
        if (user_data[i].email == req.body.loginEmail) {
            userIndex = i
            user = true
            break
        }
    }
    if (req.body. logOut) {
        req.session.authenticated = false
        req.session.user = undefined
        res.render(__dirname+"/public/index.ejs")
    }
    else if (!user) {
        console.log("No email found")
        return
    }
    else if (user_data[userIndex].password==req.body.loginPass) {
        req.session.authenticated = true;
        req.session.user = req.body.loginEmail
        console.log("login sucessful");
        res.render(__dirname+ "/public/index.ejs")
    }
    else {
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

app.post("/create_user", function (req, res) {
    registerInfo = req.body
    registerInfo["admin"] = false
    user_data.push(registerInfo)
    console.log(registerInfo)
    console.log(user_data)
    console.log("Registered")
    return res.redirect("/login")
})
