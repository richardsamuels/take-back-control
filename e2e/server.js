import express from "express";
import { fileURLToPath } from "url";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// Use a wildcard route to serve the same HTML file for any URL
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "longboi.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
