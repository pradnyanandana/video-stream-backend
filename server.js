import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_DIR = path.join(__dirname, "videos");

app.use(cors());

app.get("/video/:id", (req, res) => {
  const { id } = req.params;
  const filePath = path.join(VIDEO_DIR, `${id}.mp4`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  const videoSize = fs.statSync(filePath).size;
  const CHUNK_SIZE = 1_000_000;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  fs.createReadStream(filePath, { start, end }).pipe(res);
});

app.get("/video-url/:id", (req, res) => {
  const { id } = req.params;
  const filePath = path.join(VIDEO_DIR, `${id}.mp4`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  const host = req.protocol + "://" + req.get("host");
  res.json({ url: `${host}/video/${id}` });
});

app.get("/video-urls", (req, res) => {
  const host = req.protocol + "://" + req.get("host");
  const files = fs
    .readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((file) => {
      const id = path.parse(file).name;
      return { id, url: `${host}/video/${id}` };
    });

  res.json(files);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
