# LaporPak | Backend
## 🔧 Backend (Node.js + Hapi.js)

Backend dari aplikasi **LaporPak** dibangun menggunakan stack JavaScript modern dengan fokus pada RESTful API, manajemen data laporan, autentikasi pengguna, dan penyimpanan media.

### 📌 Teknologi yang Digunakan:

1. **Node.js**  
   Runtime JavaScript sisi server yang digunakan untuk menjalankan aplikasi backend.

2. **Hapi.js**  
   Framework web yang ringan dan powerful untuk membangun RESTful API dan menangani routing, validasi, dan middleware.

3. **MongoDB Atlas**  
   Database NoSQL berbasis cloud (dokumen) yang digunakan untuk menyimpan data laporan, pengguna, dan informasi terkait lainnya.

4. **Mongoose**  
   ODM (Object Data Modeling) untuk Node.js yang mempermudah dalam membuat skema data dan melakukan interaksi dengan MongoDB.

5. **Cloudinary**  
   Layanan penyimpanan cloud untuk mengelola upload media seperti gambar laporan secara efisien dan terstruktur.

---

### 🚀 Cara Menjalankan Backend (Development)

```bash
# Masuk ke folder backend
cd backend

# Instal semua dependensi
npm install

# Buat file `.env` di root folder backend berdasarkan contoh berikut:
### 📁 Contoh Isi `.env.example`
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/LaporPakDB"
JWT_SECRET="your_jwt_secret_key"
HOST="localhost"
PORT=3000
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Jalankan server backend (development mode)
npm run start-dev
