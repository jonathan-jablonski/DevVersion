const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../constants");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("SENDGRID_API_KEY");

const User = mongoose.model("User");
const router = express.Router();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID =
  '746742004572-o016idimfp27hv64fi9l452nh98lk711.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'dGX0jows4ngS8X-ZnHR9I_LH';

// Route to handle SignUp requests
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  // Verifying if one of the fields is Empty
  if (!name || !password || !email) {
    return res.json({ error: "Please submit all required field" });
  }
  // Else we search the user with the credentials submitted
  User.findOne({ Email: email })
    .then((savedUser) => {
      // Verify if the user exist in the DB
      if (savedUser) {
        return res.json({ error: "This Email Is Already Used !" });
      }
      // We Hash the pwd before save into DB, more the number is high more it's more secure
      bcrypt.hash(password, 12).then((hashedPwd) => {
        const user = new User({
          Name: name,
          Email: email,
          Password: hashedPwd,
        });
        // We save our new user to DB
        user
          .save()
          .then((user) => {
            // after saving the user into DB we send a confirmation email
            const email = {
              from: "no-reply@devversion.com",
              to: user.Email,
              subject: "Your account has been created successfully",
              html: "<h1>Welcome to DevVersion</h1>",
            };
            sgMail.send(email);
            res.json({ message: "Saved successfully " });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Route to handle SignIn requests using server hosted by the site
router.post("/signin", (req, res) => {
  console.log("SIGNIN");
  const { email, password } = req.body;
  // Verification for an empty field
  if (!email || !password) {
    return res.json({ error: "Please provide Email or Password" });
  }
  // Check if email exist in our DB
  console.log("sign in!");
  console.log("USER?", User);
  console.log("FINDONE", User.findOne);
  // User.findOne({}).then((user) => console.log("USER FROM DATABASE", user));

  User.findOne({ Email: email })
    .then((savedUser) => {
      if (!savedUser) {
        console.log("NO USER");
        return res.json({ error: "Invalid Email or Password" });
      }
      // REMOVE
      else {
        console.log("NO SAVED USER");
      }
      bcrypt.compare(password, savedUser.Password).then((doMatch) => {
        console.log("COMPARE");
        if (doMatch) {
          console.log("DO MATCH");
          // we will generate the token based on the ID of user
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          // retrieve the user info details and send it to the front
          const { _id, Name, Email, Followers, Following, Bookmarks } =
            savedUser;
          res.json({
            token,
            user: { _id, Name, Email, Followers, Following, Bookmarks },
          });
        } else {
          console.log("INVALID EMAIL/PASSWORD");
          return res.json({
            error: "Invalid Email or Password",
          });
        }
        console.log("END OF COMPARE");
      });
    })
    .catch((err) => {
      console.log("CAUGHT ERROR!");
      console.log(err);
    });
});

router.post("/reset-pwd", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ Email: req.body.email }).then((user) => {
      if (!user) {
        console.log("simple check of the error source");
        return res.json({ error: "No User exists with that email" });
      }

      user.ResetToken = token;
      user.ExpirationToken = Date.now() + 600000; // 10min in ms
      user.save().then((result) => {
        // this section will be fully functional after adding the SendGrid API Key
        // in order to use this feature
        // the following is an example of Email template

        const email = {
          from: "no-reply@devversion.com",
          to: user.Email,
          subject: "Password Reset",
          html: `
                     <p>A request has been made to change the password of your account </p>
					 <h5>click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</h5>
					 <p> Or copy and paste the following link :</p>
					 <h5>"http://localhost:3000/reset/${token}"</h5>
					 <h5>The link is only valid for 10min</h5>
					 <h5>If you weren't the sender of that request , you can just ignore the message</h5>
                     `,
        };
        sgMail.send(email);

        res.json({ message: "check your Email Inbox" });
      });
    });
  });
});

router.post("/new-pwd", (req, res) => {
  const Password = req.body.password;
  const Token = req.body.token;
  User.findOne({ ResetToken: Token, ExpirationToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "Session expired ! Try Again with a new Request" });
      }
      bcrypt.hash(Password, 12).then((HashPwd) => {
        user.password = HashPwd;
        user.ResetToken = undefined;
        user.ExpirationToken = undefined;
        user.save().then((result) => {
          res.json({ message: "Password Updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Passport Google OAuth routes
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

passport.use(
 new GoogleStrategy(
  {
   clientID: GOOGLE_CLIENT_ID,
   clientSecret: GOOGLE_CLIENT_SECRET,
   callbackURL: "http://localhost:3000/auth/google/redirect" || "https://devver.herokuapp.com/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    let userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken
    };
    console.log('User Data:', userData);
   done(null, userData);
  }
 )
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function(req, res) {
        const googleToken = req.user.token;
        res.redirect("http://localhost:3000/");
    }
);

module.exports = router;
