const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const bodyparser = require("body-parser");

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

function main() {
  function authorize(req, res, next) {
    if (req.session.user != undefined) {
      console.log("User Detected");
      next();
    } else {
      console.log("No User Detected");
      res.status(200).redirect("/");
    }
  }

  app.get("/authorization", (req, res) => {
    if (req.session.user == undefined) {
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  });

  app.get("/js/index.min.js", (req, res) => {
    res.sendFile(__dirname + "/node_modules/confetti-js/dist/index.min.js");
  });

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
            res.redirect("/profile");
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

  app.get("/donation", authorize, (req, res) => {
    res.render(__dirname + "/public/donation.ejs", {
      session: req.session.authenticated,
    });
  });

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

  app.get("/contactUs", (req, res) => {
    res.render(__dirname + "/public/contact.ejs", {
      session: req.session.authenticated,
    });
  });

  app.post("/create_user", function (req, res) {
    console.log(req.body)
    dtc08db.collection(`userAccounts`).find({
      email: {$eq: req.body["email"]}
    }).toArray((err, data) => {
      if (err) {throw err}
      if (data.length > 0) {
        return res.redirect("/signup");
      } else {
        registerInfo = req.body;
        registerInfo["isAdmin"] = false;
        registerInfo["savedNews"] = [];
        registerInfo["savedConflicts"] = [];
        dtc08db.collection("userAccounts").insertOne(registerInfo);
        console.log(registerInfo);
        return res.redirect("/login");
      }
    })
  });

  app.post("/updateUser", (req, res) => {
    console.log(req.body);
    dtc08db
      .collection("userAccounts")
      .updateOne(
        { email: { $eq: req.session.user } },
        { $set: { password: req.body.password } }
      );
    res.redirect("/profile");
  });

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
        console.log(result);
        res.render(__dirname + "/public/conflictProfile.ejs", {
          session: req.session.authenticated,
          conflictName: result[0].conflictName,
          country: result[0].country,
          description: result[0].description,
          id: id,
        });
      });
  });

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

  app.get("/getArticles/:id", (req, res) => {
    console.log(req.params.id);
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

  app.post("/saveArticle/:id", (req, res) => {
    dtc08db
      .collection("userAccounts")
      .updateOne(
        { email: { $eq: req.session.user } },
        { $push: { savedNews: req.params.id } }
      );
    res.status(200).send("News article saved to your read later list.");
  });

  app.post("/saveConflict/:id", (req, res) => {
    dtc08db
      .collection(`userAccounts`)
      .updateOne(
        { email: { $eq: req.session.user } },
        { $push: { savedConflicts: mongoose.Types.ObjectId(req.params.id) } }
      );
    res.status(200).send("Conflict saved to your watch list.");
  });

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

  app.post("/removeNews/:id", (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    dtc08db.collection("userAccounts").findOneAndUpdate(
      {email: {$eq: req.session.user}},
      {$pull: {savedNews: req.params.id}}
    );
    res.status(200).send("News Removed from Read Later List");
  })

  app.get("/news", (req, res) => {
    res.render(__dirname + "/public/news.ejs", {
      session: req.session.authenticated,
    });
  });

  app.post("/saveNews", (req, res) => {
    dtc08db
      .collection(`userAccounts`)
      .updateOne(
        { user: { $eq: req.session.user } },
        { $push: { savedNews: req.body.temp } }
      );
  });

  // app.get("/getArticle/:id", (req, res) => {
  //   dtc08db.collection(`newsArticles`).find({
  //     _id: {$eq: req.params.id}
  //   }).toArray((err, result) => {
  //     res.status(200).send(result);
  //   })
  // })

  app.get("/charities", (req, res) => {
    res.render(__dirname + "/public/charity.ejs", {
      session: req.session.authenticated,
    });
  });

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

  console.log("set up complete");
}

mongoose.connect(
  "mongodb+srv://frostbind:Alex1427@cluster0.5wm77.mongodb.net/dtc08db?retryWrites=true&w=majority",
  function (err, db) {
    if (err) {
      throw err;
    }
    dtc08db = db;
    main();
  }
);
