const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const PORT = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();

// Setting up views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

// Middleware for serving static files and parsing URL-encoded data
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connecting to MongoDB
main()
  .then(() => {
    console.log("Connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // This is the logged-in user
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    emailid: "student@gmail.com",
    username: "student",
  });
  let registerUser = await User.register(fakeUser, "helloWorld");
  res.send(registerUser);
});

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

// Route to check if the server is working
app.get("/", (req, res) => {
  res.send("Working properly");
});

// Catch-all route for unhandled routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { message });
});

// Server listening on specified port
app.listen(PORT, () => {
  console.log(`Server is listening on port: http://localhost:${PORT}`);
});
