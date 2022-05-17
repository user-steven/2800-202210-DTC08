const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

app.set("view engine", "ejs");


const bodyparser = require("body-parser");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);


let dtc08db;
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

console.log(dtc08db);

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

app.use(express.static("./public"));

app.get("/js/index.min.js", (req, res) =>{
  res.sendFile(__dirname + "/node_modules/confetti-js/dist/index.min.js")
})

app.get("/", (req, res) => {
  res.render(__dirname + "/public/index.ejs", {
    session: req.session.authenticated,
  });
});

app.post("/", (req, res) => {
  let user;

  if (req.body.logOut === "") {
    req.session.authenticated = false;
    req.session.user = undefined;
    req.session.isAdmin = false;
    console.log("logout successful");
    res.render(__dirname + "/public/index.ejs", {
      session: req.session.authenticated,
    });
  } else {
    dtc08db
      .collection("userAccounts")
      .find({ email: { $eq: req.body.loginEmail } })
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        if (result.length > 0) {
          user = result[0];
        }

        if (!user) {
          console.log("No email found");
          return;
        } else if (user.password === req.body.loginPass) {
          req.session.authenticated = true;
          req.session.user = req.body.loginEmail;
          req.session.isAdmin = user.isAdmin;
          console.log("login sucessful");
          res.render(__dirname + "/public/index.ejs", {
            session: req.session.authenticated,
          });
        } else {
          console.log("wrong credentials");
          res.redirect("/login");
        }
      });
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

app.get("/donation", (req, res) => {
  res.render(__dirname + "/public/donation.ejs", {
    session: req.session.authenticated,
  })
})

app.get("/getUser", (req, res) => {
  if (!req.session.authenticated) {
    res.send(`not logged in`);
  } else {
    dtc08db.collection(`donationEvents`).find(
      {user: {$eq: req.session.user}}
      ).toArray(function(err, result) {
        if (err) {throw err}
          res.status(200).send(result);
      })
  }
})

app.post("/insert", (req, res) => {
  dtc08db.collection(`donationEvents`).insertOne({
    "user": req.session.user,
    "charityName": req.body.charityName,
    "dateDonated": req.body.dateDonated,
    "amountDonated": req.body.amountDonated,
  }).then(function(result) {
    setTimeout(() => {
      res.render(__dirname + "/public/donation.ejs", {
        session: req.session.authenticated,
      });
    }, 10000);
  })
})

app.get("/contactUs", (req, res) => {
  res.render(__dirname + "/public/contact.ejs", {
    session: req.session.authenticated,
  });
});

app.post("/create_user", function (req, res) {
  registerInfo = req.body;
  registerInfo["isAdmin"] = false;
  dtc08db.collection("userAccounts").insertOne(registerInfo);
  console.log(registerInfo);
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
