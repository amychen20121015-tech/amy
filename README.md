# 大女孩愛咪／金心香連

由現有 Prototype 移植的 Astro 靜態首頁。保留原文、圖片、配色、響應式排版與分類篩選。

## 本機開啟

雙擊「啟動網站.cmd」，等待啟動後開啟 http://127.0.0.1:4321/ 。關閉啟動視窗會停止網站。

開發指令：`npm run dev`；正式建置：`npm run build`；預覽建置：`npm run preview`。

## 檔案位置

- `src/pages/index.astro`：首頁與網頁資訊。
- `src/content/homepage.html`：原有首頁內容，僅由本機編輯者維護的靜態 HTML。
- `src/styles/global.css`：原版電腦／手機樣式。
- `src/scripts/journal.js`：文章分類篩選。
- `public/`：原始圖片與其他靜態資源。

Google 字型、社群與預約連結沿用 Prototype，使用這些外部服務需要網路。原 Prototype 備份保留於 `work/site`。
