import { fileURLToPath } from "url";
import { logEvents } from "./logevents/logevents.js";
import http from "http";
import EventEmitter from "events";
import path, { dirname } from "path";
import fs from "fs";
import { checkIfFileExists } from "./utils/index.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const fsPromises = fs.promises;
const PORT = 4000;

const serverFile = async (
  filePath: string,
  contentType: string,
  response: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }
) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("/image") ? "utf-8" : "hex"
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(200, { "content-type": contentType });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.end();
  }
};

class Emitter extends EventEmitter {}
const myEmittor = new Emitter();
// console.log(path.join(__dirname, "views", "index.html"));

const server = http.createServer((req, res) => {
  const extension = path.extname(req.url || "");
  // console.log(
  //   "ext ------->",
  //   Boolean(extension),
  //   "url==========>",
  //   req.url,
  //   "is not  /",
  //   req.url?.slice(-1) !== "/"
  // );
  let contentType: string;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;

    default:
      contentType = "text/html";
      break;
  }
  const fileURLToPath = () => {
    if (contentType === "text/html" && req.url === "/") {
      console.log("1st");
      return path.join(__dirname, "views", "index.html");
    } else if (contentType === "text/html" && req.url?.slice(-1) === "/") {
      console.log("2nd");

      return path.join(__dirname, "views", req.url, "index.html");
    } else if (!extension && req.url?.slice(-1) !== "/") {
      console.log("3rd");

      return path.join(__dirname, "views", `${req.url}.html`!);
    } else {
      console.log("4th");
      return path.join(
        __dirname,
        `${
          extension !== ".json" || req.url !== "/new-page.html" ? "/views" : ""
        }`,
        req.url!
      );
    }
  };
  const filePath = fileURLToPath();
  console.log("fileName", filePath);
  const fileExists = checkIfFileExists(filePath);
  if (fileExists) {
    serverFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { location: "/" });
        res.end();
        break;
      default:
        serverFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

// myEmittor.on("log", (msg) => logEvents(msg));
//   myEmittor.emit("log", "log event emitted");
