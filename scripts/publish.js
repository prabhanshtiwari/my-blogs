import fs from "fs";
import path from "path";
import matter from "gray-matter";

const filePath = process.argv[2];

if (!filePath) {
  console.log("❌ Provide file path");
  process.exit(1);
}

// ===== LOAD DB =====
const dbPath = "./published.json";
let db = {};

if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

// ===== READ FILE =====
const file = fs.readFileSync(filePath, "utf-8");
const { data, content } = matter(file);

// ===== VALIDATION =====
if (!data.title || !data.tags || typeof data.published === "undefined") {
  console.error("❌ Missing required frontmatter (title, tags, published)");
  process.exit(1);
}

// ===== EXTRACT YEAR/MONTH =====
const parts = filePath.split(path.sep);
const year = parts[1];
const month = parts[2];

if (!year || !month) {
  console.error("❌ Invalid folder structure");
  process.exit(1);
}

// ===== DATE VALIDATION =====
if (data.date) {
  const d = new Date(data.date);
  const metaYear = String(d.getFullYear());
  const metaMonth = String(d.getMonth() + 1).padStart(2, "0");

  if (year !== metaYear || month !== metaMonth) {
    console.warn("⚠️ Folder and date mismatch");
  }
}

// ===== CREATE OR UPDATE =====
async function publishToDevto() {
  try {
    const existing = db[filePath];

    const method = existing ? "PUT" : "POST";
    const url = existing
      ? `https://dev.to/api/articles/${existing.id}`
      : "https://dev.to/api/articles";

    console.log(existing ? "♻️ Updating..." : "🚀 Creating...");

    const res = await fetch(url, {
      method,
      headers: {
        "api-key": process.env.DEVTO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article: {
          title: data.title,
          published: data.published,
          tags: data.tags,
          body_markdown: content,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Dev.to Error:", err);
      process.exit(1);
    }

    const result = await res.json();

    console.log(existing ? "♻️ Updated:" : "✅ Published:", result.url);

    // ===== SAVE STATE =====
    db[filePath] = {
      id: result.id, // 👈 CRITICAL FOR UPDATES
      title: data.title,
      url: result.url,
      date: new Date().toISOString(),
    };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    process.exit(1);
  }
}

// ===== RUN =====
(async () => {
  await publishToDevto();
})();
