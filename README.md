# 🧠 Mindslide AI

**Mindslide AI** adalah sebuah aplikasi cerdas yang memudahkan Anda dalam menyusun presentasi. Cukup unggah dokumen Anda (PDF, DOCX, atau TXT), dan biarkan AI kami merangkum konten penting dan mengubahnya secara otomatis menjadi file PowerPoint (.pptx) yang rapi, informatif, dan siap digunakan.

## 🚀 Fitur Unggulan

- 📄 **Upload Dokumen** — Mendukung berbagai format: `.pdf`, `.docx`, `.txt`
- 🧠 **AI Ringkasan Otomatis** — Menggunakan model NLP untuk mengekstrak dan merangkum informasi penting
- 🖼️ **Generate Slide PowerPoint (.pptx)** — Slide otomatis disusun berdasarkan ringkasan konten
- 🌐 **Antarmuka Web Modern** — Desain clean, responsive, dan dark mode siap pakai
- ⚙️ **Arsitektur Tim Terbagi** — Dibangun oleh tim 2 frontend & 1 backend developer

## 🧑‍💻 Tech Stack

### Frontend
- React.js + TailwindCSS
- Zustand / Redux (jika ada state management)
- Axios untuk komunikasi API

### Backend
- Node.js (Express.js)
- OpenAI API / LLM Engine (untuk summarization)
- `pptxgenjs` (untuk generate file PowerPoint)
- Multer (untuk upload file)

### Deployment
- Vercel / Netlify (Frontend)
- Railway / Render / VPS (Backend)

## 📦 Cara Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/maulidihidayat/frontend-itfest.git
cd mindslide-ai
