const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { configDotenv } = require("dotenv");
const app = express();

if (process.env.NODE_ENV !== "Development") {
  configDotenv({ path: ".env" });
}

// DB CONNECTION
require("./config/database/connection.js");

const allowedOrigins = [
  "http://203.161.42.90:5000",
  "http://203.161.42.90:443",
  "http://203.161.42.90:80",
  "http://203.161.42.90",
  "http://localhost:5000",
  "http://localhost:3000",
  "http://16.16.43.100",
  "http://16.16.43.100"
];

const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
};

app.use(cors(corsOptions));
// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pdfs")));

const userRouter = require("./routes/userRoutes.js");
const formRouter = require("./routes/formRoutes.js");



app.use("/api/v1/user", userRouter);
app.use("/api/v1/form", formRouter);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/"));
});
app.get("/test", (req, res) => {
  res.send("fh fjkghfjgjh  dhfjh");
});


app.get("*", (req, res) => {
  res.status(404).json({
    code: 404,
    info: "Not Found.",
    status: true,
    message: "The resource you looking for needs an valid end point."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT);

module.exports = app;
