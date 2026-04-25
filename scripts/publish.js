import fs from "fs";
import path from "path";
import matter from "gray-matter";
import fetch from "node-fetch";

const filePath = process.argv[2];

if (!filePath) {
  console.log("❌ Provide file path");
  process.exit(1);
}

// Read file
const file = fs.readFileSync(filePath, "utf-8");
const { data, content } = matter(file);

// Extract year/month from folder
const parts = filePath.split(path.sep);

const year = parts[1];
const month = parts[2];

// Validate
if (!year || !month) {
  console.error("❌ Invalid folder structure");
  process.exit(1);
}

// Validate date vs folder
if (data.date) {
  const d = new Date(data.date);
  const metaYear = String(d.getFullYear());
  const metaMonth = String(d.getMonth() + 1).padStart(2, "0");

  if (year !== metaYear || month !== metaMonth) {
    console.warn("⚠️ Folder and date mismatch");
  }
}

// Publish to Dev.to
async function publishToDevto() {
  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "api-key": process.env.DEVTO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      article: {
        title: data.title,
        published: data.published,
        tags: [...data.tags, year, month],
        body_markdown: content,
      },
    }),
  });

  const result = await res.json();
  console.log("✅ Published:", result.url || result);
}

// Run
(async () => {
  await publishToDevto();
})();
