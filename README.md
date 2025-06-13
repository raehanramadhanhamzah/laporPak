# LaporPak: Sistem Pelaporan Masyarakat Terintegrasi dengan Instansi Pemerintah


## Deskripsi Proyek

LaporPak adalah platform website inovatif yang mengintegrasikan teknologi pengolahan bahasa alami dengan aplikasi web modern untuk menciptakan sistem pelaporan kebakaran yang efisien, transparan, dan terintegrasi antara masyarakat dan instansi Damkar. Sistem ini menyelesaikan masalah fragmentasi sistem pelaporan kebakaran di Indonesia dimana 72% warga mengalami kesulitan melaporkan kejadian secara tepat waktu.

## Tim Pengembang (CC25-CF110)

### Advisor Capstone
- **Marya Batubara** - AD25-335 - May 16, 2025
- **R Surahutomo Aziz Pradana** - AD25-304 - May 26, 2025

### Frontend/Backend (FEBE)
- **Andi Muh Haikal L** - FC208D5Y1294 - Universitas Hasanuddin
- **Muhammad Zulfikri Sadrah** - FC208D5Y1667 - Universitas Hasanuddin  
- **Raehan Ramadhan Hamzah** - FC208D5Y1702 - Universitas Hasanuddin

### Machine Learning (ML)
- **Andi Adnan** - MC208D5Y1340 - Universitas Hasanuddin
- **Muh. Yusuf Fikry** - MC208D5Y1665 - Universitas Hasanuddin
- **Zefanya Farrel Palinggi** - MC208D5Y1257 - Universitas Hasanuddin

## Fitur Utama

### 🤖 Machine Learning
- Model klasifikasi teks multiclass menggunakan TensorFlow BertForSequenceClassification
- Transfer learning untuk pemahaman konteks laporan berbahasa Indonesia
- Konversi model ke TensorFlow Lite untuk implementasi multi-platform
- Preprocessing komprehensif dengan pembersihan data, tokenisasi, dan stopword removal
- Evaluasi menggunakan accuracy, f1-score, dan confusion matrix

### 🌐 Frontend
- Platform mobile-friendly dengan React.js dan Vite
- Portal Pelaporan Masyarakat untuk melaporkan kebakaran dengan upload bukti visual
- Dashboard Staff Damkar untuk monitoring dan update status laporan
- Dashboard Admin dengan manajemen komprehensif staff Damkar
- Styling mobile-first menggunakan Tailwind CSS
- Integrasi peta lokasi kebakaran dengan Leaflet

### ⚙️ Backend
- Arsitektur server menggunakan Node.js dengan Hapi Framework
- Database MongoDB Atlas dengan Mongoose ODM
- Sistem autentikasi JWT dengan role-based access control
- Upload file gambar/video menggunakan Cloudinary cloud storage
- API untuk integrasi dengan model ML dan klasifikasi otomatis

## Teknologi yang Digunakan

### Machine Learning
- **TensorFlow** - Framework utama untuk model ML
- **TensorFlow Lite** - Implementasi multi-platform
- **BERT** - Model transformer untuk klasifikasi teks
- **Python** - Bahasa pemrograman utama
- **Scikit-learn** - Evaluasi dan preprocessing
- **Pandas & NumPy** - Manipulasi data

### Frontend 
- **React.js** - JavaScript framework
- **Vite** - Module bundler dan dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client untuk networking calls
- **Leaflet** - Interactive maps
- **Responsive Design** - Support semua ukuran layar

### Backend 
- **Node.js** - Runtime environment
- **Hapi Framework** - Web framework (sesuai requirement)
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Authentication dan authorization
- **Cloudinary** - Media storage cloud
- **RESTful API** - Standar konvensi URL

### DevOps & Deployment
- **Railway** - Backend hosting
- - **Vercel** - Frontend hosting
- **GitHub** - Version control
- **MongoDB Atlas** - Database cloud

### Prerequisites
- **Node.js** (v16 atau lebih baru) - Runtime JavaScript sisi server
- **Python** (v3.8 atau lebih baru) - Untuk model Machine Learning
- **Git** - Version control system
- **MongoDB Atlas Account** - Database NoSQL cloud
- **Cloudinary Account** - Cloud media storage
- **Railway And Vercel Account** - Platform deployment

### Langkah 1: Clone Repository
```bash
git clone https://github.com/laporpak/laporpak.git
cd laporpak
```

### Langkah 2: Setup Backend (Node.js + Hapi.js)

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Setup MongoDB Atlas
1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Buat cluster baru (pilih tier gratis)
3. Setup Network Access (tambahkan IP 0.0.0.0/0 untuk akses global)
4. Buat Database User dengan password
5. Dapatkan connection string

#### 2.3 Setup Cloudinary
1. Daftar di [Cloudinary](https://cloudinary.com/)
2. Dapatkan Cloud Name, API Key, dan API Secret dari dashboard
3. Konfigurasi untuk upload media (gambar/video laporan)

#### 2.4 Konfigurasi Environment Variables
Buat file `.env` di folder backend:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/laporpak
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2.5 Structure Backend dengan Hapi.js
```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Database & app config
│   └── utils/          # Utility functions
├── uploads/            # Temporary file storage
├── package.json
└── server.js          # Main server file
```

#### 2.6 Mongoose Models Setup
```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'staff', 'admin'], default: 'citizen' }
});

// models/Report.js
const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  media: [{ type: String }], // Cloudinary URLs
  status: { type: String, enum: ['pending', 'processing', 'resolved'], default: 'pending' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
```

#### 2.7 Jalankan Backend
```bash
npm run start:dev
```

### Langkah 3: Setup Frontend (React.js + Vite)

#### 2.8 Install Dependencies
```bash
cd frontend
npm install
```

#### 2.9 Structure Frontend
```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   └── Navbar.jsx    # Navigation component
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin dashboard
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── components/
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── AdminHeader.jsx
│   │   │       ├── DashboardView.jsx
│   │   │       ├── ReportsView.jsx
│   │   │       └── UsersView.jsx
│   │   ├── staff/        # Staff dashboard
│   │   │   └── StaffDashboard.jsx
│   │   ├── auth/         # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── LoginPresenter.jsx
│   │   │   └── register/
│   │   │       └── RegisterPresenter.jsx
│   │   ├── homepage/     # Landing page
│   │   │   └── Homepage.jsx
│   │   ├── user/         # User pages
│   │   │   ├── MyReports.jsx
│   │   │   └── Profile.jsx
│   │   ├── report-form/  # Report submission forms
│   │   │   ├── StandardFormPresenter.jsx
│   │   │   └── QuickFormPresenter.jsx
│   │   ├── about/        # About page
│   │   │   └── About.jsx
│   │   └── statistics/   # Statistics page
│   │       └── Statistics.jsx
│   ├── routes/           # Route protection
│   │   ├── PrivateRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── StaffRoute.jsx
│   ├── services/         # API calls
│   │   └── api.js        # Axios configuration
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global CSS with Tailwind
├── public/               # Static assets
├── package.json
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS config
```

#### 3.0 Setup Axios untuk API Calls
```javascript
// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

#### 3.1 Jalankan Frontend
```bash
npm run dev
```

### Langkah 4: Setup Machine Learning

#### 4.1 Install Dependencies Python
```bash
cd ml-models
pip install -r requirements.txt
```

#### 4.2 Requirements.txt
```
tensorflow==2.13.0
transformers==4.21.0
pandas==1.5.3
numpy==1.24.3
scikit-learn==1.3.0
flask==2.3.2
python-dotenv==1.0.0
```

#### 4.3 Model Training Script
```python
# train_model.py
import tensorflow as tf
from transformers import TFAutoModel, AutoTokenizer
import pandas as pd

# Load pre-trained BERT model
model_name = "indolem/indobert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
bert_model = TFAutoModel.from_pretrained(model_name)

# Preprocessing dan training code
def preprocess_data(texts):
    # Tokenisasi, cleaning, dll
    pass

def create_model():
    # Build classification model dengan BERT
    pass
```

#### 4.4 API Inference
```python
# app.py
from flask import Flask, request, jsonify
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model('saved_model/')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data['text']
    # Preprocessing dan prediksi
    result = model.predict([text])
    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Authentication
- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/profile` - Profile pengguna

### Laporan Kebakaran
- `GET /api/reports` - Daftar laporan
- `POST /api/reports` - Buat laporan baru
- `GET /api/reports/:id` - Detail laporan
- `PUT /api/reports/:id/status` - Update status laporan

### ML Classification
- `POST /api/ml/classify` - Klasifikasi laporan otomatis
- `GET /api/ml/model-info` - Informasi model

## Deployment

### Frontend
```bash
npm run build
# Deploy ke Netlify/Vercel
```

### Backend
```bash
# Deploy ke Railway
git push railway main
```

### ML Model
```bash
# Deploy model inference API
python deploy.py
```

## Kontak

Tim LaporPak - CC25-CF110

Project Link: [https://github.com/laporpak/laporpak](https://github.com/laporpak/laporpak)
