import fs from "fs";
import { newFile } from "../utils/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const fsPromises = fs.promises;
export const __dirname = dirname(fileURLToPath(import.meta.url));

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(
      newFile(__dirname, "starter.txt"),
      "utf-8"
    );
    console.log(data);
    await fsPromises.writeFile(
      newFile(__dirname, "newFiles.txt"),
      "hello this is new file"
    );
    console.log("write");
    await fsPromises.appendFile(
      newFile(__dirname, "newFiles.txt"),
      "hello this is new file edited"
    );
    await fsPromises.rename(
      newFile(__dirname, "newFiles.txt"),
      newFile(__dirname, "renameFile.txt")
    );
    console.log("edited");
  } catch (error) {
    console.log(error);
  }
};

fileOps();
console.log("...loading");
// fs.readFile(path.join(__dirname, "starter.txt"), "utf-8", (err, data) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log("readingg.....", data);
//   }
// });

//call back helll
// fs.writeFile(
//   path.join(__dirname, "hello.txt"),
//   "hello this is new file-8",
//   (err) => {
//     if (err) {
//       throw err;
//     } else {
//       console.log("write complete");
//       fs.appendFile(
//         path.join(__dirname, "hello.txt"),
//         "hello this is new edited-8",
//         (err) => {
//           if (err) {
//             throw err;
//           } else {
//             console.log("append complete");
//             fs.rename(
//               path.join(__dirname, "hello.txt"),
//               path.join(__dirname, "renaming.txt"),
//               (err) => {
//                 if (err) {
//                   throw err;
//                 } else {
//                   console.log("rename complete");
//                 }
//               }
//             );
//           }
//         }
//       );
//     }
//   }
// );

// console.log(path.join("loading......."));

//exit on uncaught error
process.on("uncaughtException", (err) => {
  console.error(`error ${err}`);
  process.exit(1);
});
