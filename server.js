const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

app.set("view engine", "ejs");
let dtc08db;

const bodyparser = require("body-parser");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  "mongodb+srv://frostbind:Alex1427@cluster0.5wm77.mongodb.net/dtc08db?retryWrites=true&w=majority",
  function (err, db) {
    if (err) {
      throw err;
    }

    dtc08db = db;
    db.collection("userAccounts")
      .find({})
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
      });
  }
);

app.use(
  session({
    secret: "dtc8",
    saveUnintialized: true,
    resave: true,
  })
);

app.listen(process.env.PORT || 5100, function (err) {
  if (err) console.log(err);
});

var user_data = [{ email: "admin@bcit.ca", password: "bcit", admin: true }];

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render(__dirname + "/public/index.ejs", {
    session: req.session.authenticated,
  });
});

app.post("/", (req, res) => {
  let user = false;
  let userIndex = 0;
  for (i = 0; i < user_data.length; i++) {
    if (user_data[i].email === req.body.loginEmail) {
      userIndex = i;
      user = true;
      break;
    }
  }
  if (req.body.logOut) {
    req.session.authenticated = false;
    req.session.user = undefined;
    req.session.isAdmin = false;
    res.render(__dirname + "/public/index.ejs", {
      session: req.session.authenticated,
    });
  } else if (!user) {
    console.log("No email found");
    return;
  } else if (user_data[userIndex].password == req.body.loginPass) {
    req.session.authenticated = true;
    req.session.user = req.body.loginEmail;
    req.session.isAdmin = user_data[userIndex].admin;
    console.log("login sucessful");
    res.render(__dirname + "/public/index.ejs", {
      session: req.session.authenticated,
    });
  } else {
    console.log("wrong credentials");
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/");
    console.log("already have a session");
  } else {
    res.render(__dirname + "/public/login.ejs", {
      session: false,
    });
  }
});

app.get("/signup", (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/");
    console.log("already signed up");
  } else {
    res.render(__dirname + "/public/registration.ejs", {
      session: false,
    });
  }
});

app.get("/userAccounts", (req, res) => {
  console.log(req.session);
  if (req.session.isAdmin) {
    res.render(__dirname + "/public/account.ejs", {
      user_data: user_data,
      session: req.session.authenticated,
    });
  } else {
    res.redirect("/");
  }
});

app.get("/contactUs", (req, res) => {
  res.render(__dirname + "/public/contact.ejs", {
    session: req.session.authenticated,
  });
});

app.post("/create_user", function (req, res) {
  registerInfo = req.body;
  registerInfo["isAdmin"] = false;

  dtc08db.collection("userAccounts").insertOne(registerInfo);

  // user_data.push(registerInfo);
  console.log(registerInfo);
  // console.log(user_data);
  // console.log("Registered");
  return res.redirect("/login");
});

app.get("/profile", (req, res) => {
  res.render(__dirname + "/public/profile.ejs", {
    session: req.session.authenticated,
  });
});

app.get("/news", (req, res) => {
  res.render(__dirname + "/public/news.ejs", {
    session: req.session.authenticated,
  });
});

app.get("/donationHistory", (req, res) => {
  res.render(__dirname + "/public/donation.ejs", {
    session: req.session.authenticated,
  });
});

app.get("/charities", (req, res) => {
  res.render(__dirname + "/public/charity.ejs", {
    session: req.session.authenticated,
  });
});
