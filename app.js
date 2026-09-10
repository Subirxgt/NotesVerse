
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
app.set('trust proxy', 1);
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);

const { storage } = require("./cloudconfig");
const upload = multer({ storage });
const Note = require("./models/notes");
const Subject = require("./models/subjects");
const Unit = require("./models/units");
const Book = require("./models/books");
const Practical = require("./models/practicals");
const Pyq = require("./models/pyqs");
const Review = require("./models/reviews");
const User = require("./models/users");
const Contributor = require("./models/contributor");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const homeRoute = require("./routes/homeRoute");
const notesRoute = require("./routes/notesRoute");
const booksRoute = require("./routes/booksRoute");
const practicalsRoute = require("./routes/practicalsRoute");
const pyqsRoute = require("./routes/pyqsRoute");
const reviewsRoute = require("./routes/reviewsRoute");
const dbUrl = process.env.ATLASDB_URL;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

main();

const store = new MongoDBStore({
  uri: dbUrl,
  collection: "sessions",
  ttl: 7 * 24 * 60 * 60, 
});

store.on("error", (error) => {
  console.log("Session Store Error:", error);
});

const SESSION_SECRET = process.env.SESSION_SECRET || "studyadda-secret-key";

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store, 
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
    },
  })
);


app.use(flash());


const passport = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session()); 
app.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          res.locals.user = user;
          return next();
        }
      } catch (error) {
        console.log("JWT verification failed, checking session:", error.message);
        
      }
    }

    if (req.user) {
      res.locals.user = req.user;
      return next();
    }

    req.user = null;
    res.locals.user = null;
  } catch (error) {
    console.error("Auth middleware error:", error);
    req.user = null;
    res.locals.user = null;
  }

  next();
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/home", homeRoute);
app.use("/notes", notesRoute);
app.use("/books", booksRoute);
app.use("/practicals", practicalsRoute);
app.use("/pyqs", pyqsRoute);
app.use("/reviews", reviewsRoute);

app.get("/api/visits/last-7-days", async (req, res) => {
  try {
    const sessionsCollection =
      mongoose.connection.collection("sessions");

    const now = new Date();

    const totalVisitsLast7Days =
      await sessionsCollection.countDocuments({
        expires: { $gte: now }
      });

    res.status(200).json({
      metric: "visits_last_7_days",
      totalVisits: totalVisitsLast7Days,
      ttlDays: 7
    });
  } catch (error) {
    console.error("Visits API error:", error);
    res.status(500).json({
      message: "Failed to calculate visits",
      error: error.message
    });
  }
});


app.use((err, req, res, next) => {
  if (req.session && req.flash) {
    if (err.code === "LIMIT_FILE_SIZE" || err.status === 413) {
      req.flash("error", "❌ File too large! Maximum allowed size is 100MB.");
      return res.redirect("/home");
    }

    if (err.http_code === 413 || err.name === "UnexpectedResponse") {
      req.flash("error", "❌ File too large! Maximum allowed size is 100MB.");
      return res.redirect("/home");
    }

    req.flash("error", `❌ Upload failed: ${err.message}`);
  } else {
    console.error("⚠️ Flash unavailable for this error:", err.message);
  }

  console.error("Error:", err);
  res.redirect("/home");
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});


const { errorMiddleWare } = require("./middlewares/error");
app.use(errorMiddleWare);

const { removeUnverifiedAccounts } = require("./automation/removeUnverifiedAccounts");
removeUnverifiedAccounts();


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("📦 Session store: MongoDB (persistent)");
});
