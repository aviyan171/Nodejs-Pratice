import path, { dirname } from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Register, User } from "./schema/index.js";
import jwt from "jsonwebtoken";

const PORT = 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

//connect to db
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("DB connected successfully"))
  .catch();

//schema

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const Message = mongoose.model("messages", messageSchema);

const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (token) {
    const decodedData = jwt.verify(token, "sdsdsdsdsdsdsd");
    req.users = decodedData;
    next();
    return;
  }
  res.render("login"); //res.render is used in ejs for locating the file
};

//using middlewares
app.use(express.static(path.join(__dirname, "public"))); // this middleware helps to  access public page
app.use(express.urlencoded({ extended: true })); // this will get data sent from frontend otherwise it will return undefined!!!
app.use(cookieParser()); //middleware for parsing cookie

const whiteList = ["https://www.youtube.com", "https://www.facebook.com", ""];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin || "") !== -1 || origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.set("views", path.join(__dirname, "views")); // this is usedn to locate views folder for ejs
app.set("view engine", "ejs"); // this is use to configure ejs

app.get("^/$|/index(.html)?", isAuthenticated, (req: any, res) => {
  // we can also use regex

  res.render("logout", { name: req.users.userName });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const isUserExists = await Register.findOne({ Username: username });

  if (!isUserExists) {
    return res.redirect("/register");
  }
  const user = await User.create({
    Username: username,
    Password: password,
  });
  const token = jwt.sign({ _id: user._id, username }, "sdsdsdsdsdsdsd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 6000),
  });
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const isUserExists = await Register.findOne({ Email: email });
  if (isUserExists) {
    res.redirect("/");
    return;
  }
  const user = await Register.create({
    Username: username,
    Password: password,
    Email: email,
  });
  const token = jwt.sign(
    { _id: user._id, userName: username },
    "sdsdsdsdsdsdsd"
  );
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 6000),
  });
  res.redirect("/");
});

const errorHandlerMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send(err.message);
};
app.use(errorHandlerMiddleWare);

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
