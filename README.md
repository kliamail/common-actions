# Common JSON Tools

A tiny, single-page collection of JSON helpers built with  
React 19, Material-UI v7 and CodeMirror 6.

Current tools  
* JSON Formatter / Minifier  
* JSON String Unescaper ↔ Escaper  
* About (link to repo / issues)

More utilities can be added in minutes – see “Adding a new tool” below.

---

## Quick start

```bash
# 1. clone & install deps
git clone git@github.com:kliamail/common-actions.git
cd common-actions
npm install          # or yarn / pnpm

# 2. (optional) create .env containing your GA id
echo "REACT_APP_GA_ID=G-XXXXXXX" > .env

# 3. run the dev server
npm start
```

The app opens at <http://localhost:3000> and hot-reloads as you edit.

---

## Build for production

```bash
npm run build        # output goes to /build (static files)
```

Deploy the `build/` folder to any static host (Vercel, Netlify, GitHub Pages, S3 + CloudFront, …).

---

## Environment variables

| Variable           | Description                          | Example            |
| ------------------ | ------------------------------------ | ------------------ |
| `REACT_APP_GA_ID`  | Google-Analytics 4 measurement ID    | `G-AB12C3D4EF`     |

Create a local `.env.local` file; it is **git-ignored**.  
If you don’t set the variable the app just runs without analytics.

---

## Repo layout

```
common-tools/
  public/       static assets, favicon, index.html
  src/          application code
    components/ shared widgets (CodeArea, etc.)
    tools/      one file per tool
  .env.example  template for environment variables
```

---

## License

MIT
