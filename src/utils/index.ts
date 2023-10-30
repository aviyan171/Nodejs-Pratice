import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const newFile = (dirname: string, fileName: string) => {
  return path.join(dirname, fileName);
};
export const makeDir = async (newDir: string) => {
  try {
    await fs.promises.mkdir(newDir);
  } catch (error) {
    console.log(error);
  }
};

export const checkIfFileExists = (dirName: string) => {
  return fs.existsSync(dirName);
};
