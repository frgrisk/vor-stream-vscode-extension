import fs from "fs";
import path from "path";

// Locate package.json
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

// Extract version from Git tag (e.g., refs/tags/v1.2.3 → 1.2.3)
const versionMatch = process.env.GITHUB_REF?.match(
  /refs\/tags\/v(\d+\.\d+\.\d+)/,
);
if (!versionMatch) {
  console.log("update-version: no version tag in GITHUB_REF, skipping.");
  process.exit(0);
}

// Update package.json version
packageJson.version = versionMatch[1];
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
