import fs from "fs";
import path from "path";

// Locate package.json
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

// Extract version from Git tag (e.g., refs/tags/v1.2.3 → 1.2.3)
const versionMatch = process.env.GITHUB_REF?.match(
  /refs\/tags\/v(\d+\.\d+\.\d+)/,
);
const version = versionMatch ? versionMatch[1] : "0.0.0";

// Update package.json version
packageJson.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
