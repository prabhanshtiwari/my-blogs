# 📝 My Blogs — Automated Dev.to Publishing

This repo lets you:

- Write blogs in Markdown
- Push to GitHub
- Automatically send them to Dev.to as **drafts**

---

## 🚀 How to Use

### 1. Write a Blog

Create a file inside:

```
blogs/YYYY/MM/your-blog-name.md
```

Example:

```
blogs/2026/04/advanced-path-aliases-vite.md
```

---

### 2. Use This Format (Required)

```md
---
title: "Your Blog Title"
published: false
description: "Short description"
tags: ["tag1", "tag2", "tag3", "tag4"]
cover_image: https://image-url.com
---

# Your Blog Title

Start writing...
```

---

### 3. Add Dev.to API Key

Go to:

```
Repo → Settings → Secrets → Actions → New Repository Secret
```

Add:

```
DEVTO_API_KEY=your_devto_api_key
```

---

### 4. Push Your Blog

```bash
git add .
git commit -m "added new blog"
git push
```

---

### 5. If Push Fails (Rebase Fix)

If you see `non-fast-forward` error, run:

```bash
git pull --rebase
```

Then:

```bash
git add .
git rebase --continue   # only if conflicts appear
git push
```

👉 This syncs your local branch with GitHub before pushing.

---

### 6. What Happens Next

- GitHub Actions runs automatically
- Your blog is sent to Dev.to
- It appears as a **draft**

👉 You publish it manually from Dev.to

---

## ⚠️ Rules (Important)

- Max **4 tags**
- Use array format for tags
- Keep `published: false`
- Use clean file names (no spaces)

---

## 📁 Structure

```
.
├── blogs/
├── scripts/publish.js
├── .github/workflows/
├── published.json
```

---

## 💡 Summary

Write → Push → Draft created on Dev.to → Publish manually

---

## 👨‍💻 Author

Prabhansh Tiwari
