const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const bodyparser = require("body-parser");

// global variable for the app's database
let dtc08db;

app.set("view engine", "ejs");

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "dtc8",
    saveUnintialized: true,
    resave: true,
  })
);

app.use(express.static("./public"));

app.listen(process.env.PORT || 5100, function (err) {
  if (err) console.log(err);
});

// function containing all the routes
function main() {
  // Middleware to check if user has signed in
  function authorize(req, res, next) {
    if (req.session.user != undefined) {
      next();
    } else {
      res.status(200).redirect("/");
    }
  }
  // Route to get if user has signed in
  app.get("/authorization", (req, res) => {
    if (req.session.user == undefined) {
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  });
  // Route to confetti node module
  app.get("/js/index.min.js", (req, res) => {
    res.sendFile(__dirname + "/node_modules/confetti-js/dist/index.min.js");
  });
  // Route to index (home) page
  app.get("/", (req, res) => {
    res.render(__dirname + "/public/index.ejs", {
      session: req.session.authenticated,
    });
  });
  // Route for submitting login and logout
  app.post("/", (req, res) => {
    let user;
    if (req.body.logOut === "") { // if logout
      req.session.authenticated = false;
      req.session.user = undefined;
      req.session.isAdmin = false;
      console.log("logout successful");
      res.render(__dirname + "/public/index.ejs", {
        session: req.session.authenticated,
      });
    } else { // if login
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
            return res.redirect("/login");
          } else if (user.password === req.body.loginPass) {
            req.session.authenticated = true;
            req.session.user = req.body.loginEmail;
            req.session.isAdmin = user.isAdmin;
            console.log("login sucessful");
            res.redirect("/profile");
          } else {
            console.log("wrong credentials");
            res.redirect("/login");
          }
        });
    }
  });
  // Route to login page
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
  // Route to signup page
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
  // Route for admin to user accounts page
  app.get("/userAccounts", authorize, (req, res) => {
    if (req.session.isAdmin) {
      dtc08db.collection("userAccounts").find({}).toArray((err, data) => {
        if (err) {throw err}
        res.render(__dirname + "/public/account.ejs", {
          user_data: data,
          session: req.session.authenticated,
        });
      })
    } else {
      res.redirect("/");
    }
  });
  // Route to donation page
  app.get("/donation", authorize, (req, res) => {
    res.render(__dirname + "/public/donation.ejs", {
      session: req.session.authenticated,
    });
  });
  // Route to get user donation events
  app.get("/getUser", (req, res) => {
    if (!req.session.authenticated) {
      res.send(`not logged in`);
    } else {
      dtc08db
        .collection(`donationEvents`)
        .find({ user: { $eq: req.session.user } })
        .toArray(function (err, result) {
          if (err) {
            throw err;
          }
          res.status(200).send(result);
        });
    }
  });
  // Route to insert a donation event to the database
  app.post("/insert", (req, res) => {
    dtc08db
      .collection(`donationEvents`)
      .insertOne({
        user: req.session.user,
        charityName: req.body.charityName,
        dateDonated: req.body.dateDonated,
        amountDonated: req.body.amountDonated,
      })
      .then(function (result) {
        res.render(__dirname + "/public/donation.ejs", {
          session: req.session.authenticated,
        });
      });
  });
  // Route to insert a 'contact us' feedback to the database
  app.post("/contactUs/submit", (req, res) => {
    dtc08db
      .collection("contactUsFeedback")
      .insertOne({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        phone_number: req.body.pnumber,
        subject: req.body.subject,
        message: req.body.message,
      })
      .then(() => {
        res.redirect("/contactUs" + "?success");
      });
  });
  // Route to the contact us page
  app.get("/contactUs", (req, res) => {
    res.render(__dirname + "/public/contact.ejs", {
      session: req.session.authenticated,
    });
  });
  // Route to insert a new user to the database
  app.post("/create_user", function (req, res) {
    dtc08db.collection(`userAccounts`).find({
      email: {$eq: req.body["email"]}
    }).toArray((err, data) => {
      if (err) {throw err}
      if (data.length > 0) { // if user already exists
        return res.redirect("/signup");
      } else {
        registerInfo = req.body;
        registerInfo["isAdmin"] = false;
        registerInfo["savedNews"] = [];
        registerInfo["savedConflicts"] = [];
        dtc08db.collection("userAccounts").insertOne(registerInfo);
        return res.redirect("/login");
      }
    })
  });
  // Route to update user password
  app.post("/updateUser", (req, res) => {
    dtc08db
      .collection("userAccounts")
      .updateOne(
        { email: { $eq: req.session.user } },
        { $set: { password: req.body.password } }
      );
    res.redirect("/profile");
  });
  // Route to user profile page
  app.get("/profile", authorize, (req, res) => {
    dtc08db
      .collection("userAccounts")
      .find({
        email: { $eq: req.session.user },
      })
      .toArray((err, result) => {
        if (err) throw err;
        res.render(__dirname + "/public/profile.ejs", {
          session: req.session.authenticated,
          email: result[0].email,
          savedNews: result[0].savedNews,
          savedConflicts: result[0].savedConflicts,
        });
      });
  });
  // Route to conflict profile page
  app.get("/conflictProfile/:id", (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    dtc08db
      .collection(`conflicts`)
      .find({
        _id: { $eq: id },
      })
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.render(__dirname + "/public/conflictProfile.ejs", {
          session: req.session.authenticated,
          conflictName: result[0].conflictName,
          country: result[0].country,
          description: result[0].description,
          id: id,
        });
      });
  });
  // Route to get conflict from database
  app.get("/getConflict/:id", (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    dtc08db
      .collection(`conflicts`)
      .find({
        _id: { $eq: id },
      })
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
  });
  // Route to get new articles of a certain conflict
  app.get("/getArticles/:id", (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    dtc08db
      .collection(`conflicts`)
      .find({
        _id: { $eq: id },
      })
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.status(200).send(result[0].newsArticles);
      });
  });
  // Route to get a news article
  app.get("/getArticle/:id", (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    dtc08db
      .collection(`newsArticles`)
      .find({
        _id: { $eq: id },
      })
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.status(200).send(result);
      });
  });
  // Route to get a user's saved news from the database
  app.get("/getSavedNews", (req, res) => {
    dtc08db
      .collection(`userAccounts`)
      .find({
        email: { $eq: req.session.user },
      })
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.status(200).send(result[0].savedNews);
      });
  });
  // Route to get a user's saved conflicts from the database
  app.get("/getSavedConflicts", (req, res) => {
    dtc08db
      .collection(`userAccounts`)
      .find({
        email: { $eq: req.session.user },
      })
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.status(200).send(result[0].savedConflicts);
      });
  });
  // Route to save a news article to a user
  app.post("/saveArticle/:id", (req, res) => {
    dtc08db
      .collection("userAccounts")
      .updateOne(
        { email: { $eq: req.session.user } },
        { $push: { savedNews: req.params.id } }
      );
    res.status(200).send("News article saved to your read later list.");
  });
  // Route to save a conflict to a user
  app.post("/saveConflict/:id", (req, res) => {
    dtc08db
      .collection(`userAccounts`)
      .updateOne(
        { email: { $eq: req.session.user } },
        { $push: { savedConflicts: mongoose.Types.ObjectId(req.params.id) } }
      );
    res.status(200).send("Conflict saved to your watch list.");
  });
  //Route to remove a conflict from a user
  app.post("/removeConflict/:id", (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    dtc08db
      .collection(`userAccounts`)
      .findOneAndUpdate(
        { email: { $eq: req.session.user } },
        { $pull: { savedConflicts: id } }
      );
    res.status(200).send("Conflict removed from watch list.");
  });
  // Route to remove a news article from a user
  app.post("/removeNews/:id", (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    dtc08db.collection("userAccounts").findOneAndUpdate(
      {email: {$eq: req.session.user}},
      {$pull: {savedNews: req.params.id}}
    );
    res.status(200).send("News Removed from Read Later List");
  })
  // Route to the news page
  app.get("/news", (req, res) => {
    res.render(__dirname + "/public/news.ejs", {
      session: req.session.authenticated,
    });
  });
  // Route to charities page
  app.get("/charities", (req, res) => {
    res.render(__dirname + "/public/charity.ejs", {
      session: req.session.authenticated,
    });
  });
  // Route to get the top 10 news articles 
  app.get("/findTopTenArticles", (req, res) => {
    dtc08db
      .collection("newsArticles")
      .find()
      .sort({ clicks: -1 })
      .limit(10)
      .toArray((err, result) => {
        res.send(result);
      });
  });
}

// Connect to mongoDB database
mongoose.connect(
  "mongodb+srv://frostbind:Alex1427@cluster0.5wm77.mongodb.net/dtc08db?retryWrites=true&w=majority",
  function (err, db) {
    if (err) {
      throw err;
    }
    dtc08db = db;
    // Call main function that contains all the routes
    main();
  }
);
