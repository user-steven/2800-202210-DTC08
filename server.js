const express = require('express');
const { path } = require('express/lib/application');
const res = require('express/lib/response');
const app = express()

app.use(express.static("./public"));

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/public/index.html")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})
