const express = require('express');
const { path } = require('express/lib/application');
const res = require('express/lib/response');
const app = express()

app.listen(5100, function(err){
    if(err) console.log(err);
    })

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/public/index.html")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})