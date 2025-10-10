import express from "express";
import serveStatic from "serve-static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log(path.join(__dirname, "..", "storybook-static"));

// Serve static files from storybook-static directory
app.use(
  serveStatic(path.join(__dirname, "..", "storybook-static"), {
    index: ["index.html"],
  }),
);

app.listen(PORT, () => {
  console.log(`Storybook server running at http://localhost:${PORT}`);
});
