import { logEvents } from "./logevents/logevents.js";
import EventEmitter from "events";
class MyEmitter extends EventEmitter {}

//impp
// const __filename = path.parse(fileURLToPath(import.meta.url));

// console.log(format(new Date(), "yy/mm/dd"));
// console.dir(uuid());
const myEmittor = new MyEmitter();
myEmittor.on("log", (msg) => logEvents(msg));

setTimeout(() => {
  myEmittor.emit("log", "log event emitted");
}, 2000);
