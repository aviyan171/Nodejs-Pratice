import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { newFile, makeDir } from "../utils/index.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const rs = fs.createReadStream(newFile(__dirname, "lorem.txt"), {
  encoding: "utf-8",
});

const ws = fs.createWriteStream(newFile(__dirname, "newloremstream.txt"));

// rs.on("data", (dataChunk) => {
//   ws.write(dataChunk);
// });
if (!fs.existsSync("./src/dir")) {
  makeDir("./src/dir");
}
rs.pipe(ws);
