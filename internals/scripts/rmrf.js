import fs from "node:fs";

const args = process.argv;
if (args.length === 2) {
  console.error("Expected an argument for the directory to be deleted");
  process.exit(1);
}

const dir = args[2];

fs.rm(dir, { recursive: true, force: true }, (err) => {
  console.info(`Cleaning up old build files...`);
  if (err) {
    throw err;
  }
  console.info(`Done.`);
});
