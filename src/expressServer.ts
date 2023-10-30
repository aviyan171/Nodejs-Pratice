import path, { dirname } from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import type { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express";

const PORT = 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const users: any = [];
//using middlewares
app.use(express.static(path.join(__dirname, "public"))); // this middleware helps to  access public page
app.use(express.urlencoded({ extended: true })); // this will get data sent from frontend otherwise it will return undefined!!!

const whiteList = ["https://www.youtube.com", "https://www.facebook.com"];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin || "") !== -1 || !origin) {
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
  // we can also use regex
  res.render("index", { name: "Abhiyan" });
});
app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

app.post("/form-submission", (req, res) => {
  console.log(req.body);
  users.push(req.body);
  console.log(users);
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
