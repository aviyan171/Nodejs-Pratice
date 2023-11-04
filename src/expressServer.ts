import path, { dirname } from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

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

app.get("^/$|/index(.html)?", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.render("logout");
  } else {
    res.render("login"); //res.render is used in ejs for locating the file
  }
  // we can also use regex
});
app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});
app.get("/add", async (req, res) => {
  try {
    await Message.create({
      name: "anmol",
      email: "upreti@gmail.com",
    });
    res.send("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/form-submission", async (req, res) => {
  const { name, email } = req.body;
  const messageBody = { name, email };
  await Message.create(messageBody);
  console.log(messageBody);
  res.render("success");
});

//routes handles
const one = (req: any, res: any, next: any) => {
  console.log("1");
  next();
};
const two = (req: any, res: any, next: any) => {
  console.log("2");
  next();
};
const three = (req: any, res: any) => {
  console.log("3");
  res.json({
    success: true,
    products: [],
  });
};
app.get("/chain(.html)?", [one, two, three]);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.post("/login", (req, res) => {
  res.cookie("token", "i am in", {
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
