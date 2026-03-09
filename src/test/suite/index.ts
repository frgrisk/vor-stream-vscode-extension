import * as fs from "fs";
import * as path from "path";
import Mocha from "mocha";

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: "tdd", color: true, timeout: 10000 });
  const testsRoot = __dirname;

  return new Promise((resolve, reject) => {
    fs.readdirSync(testsRoot)
      .filter((f) => f.endsWith(".test.js"))
      .forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} tests failed.`));
      } else {
        resolve();
      }
    });
  });
}
