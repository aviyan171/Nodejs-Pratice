import path, { dirname } from "path";
import { format } from "date-fns";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { checkIfFileExists, makeDir, newFile } from "../utils/index.js";
import { fileURLToPath } from "url";

const fsPromises = fs.promises;
const __dirname = dirname(fileURLToPath(import.meta.url));
export const logEvents = async (message: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!checkIfFileExists(path.join(__dirname, "logs"))) {
      await makeDir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", "eventLog.txt"),
      logItem
    );
  } catch (error) {
    console.log(error, "........................>");
  }
};
