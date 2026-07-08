# Isha Kakadiya — Professional Data Science & ML Portfolio

Welcome to my personal portfolio repository! This is a modern, fully dynamic React application built with a responsive client-side experience and an integrated secure Firebase CMS Admin Dashboard.

---

## 🚀 Live Demo & Admin Panel
* **Portfolio Homepage**: [https://ishakakadiya.netlify.app](https://ishakakadiya.netlify.app)
* **Admin Login**: `/login` (Google OAuth whitelist secured)
* **CMS Dashboard**: `/admin`

---

## ✨ Features
1. **Interactive Resume & Timeline**: Fully interactive timeline entries for work experience and academic background with **click-to-expand details** and direct **completion certificate links**.
2. **Dynamic Project Case Studies**: High-resolution showcase cards featuring structured overviews, methodology, results, and quick links to live demos and GitHub repositories.
3. **Secure CMS Dashboard**: Built-in admin panel supporting real-time CRUD operations on:
   * Profile/Hero details
   * Skills & Frameworks
   * Academic Background & Work Experience
   * Project metadata (including thumbnail and gallery uploads)
4. **Google OAuth Whitelist Authentication**: Protects the admin panel using a strict email whitelist matching Firebase Auth users.
5. **Zero-Crash Local Fallback**: Seamless fallback system reading from a local `Data.json` file if Firestore is empty or connection is lost.

---

## 🧰 Tech Stack
* **Frontend Core**: React.js, Vite, Sass (SCSS)
* **Backend Database**: Firebase Firestore (NoSQL Cloud Database)
* **Authentication**: Firebase Authentication (Google Auth Popup Flow)
* **Media Storage**: Cloudinary (integrated image and document uploader)
* **Hosting Platform**: Netlify (preconfigured serverless routing)

---

## 💻 Local Installation & Setup

### 1. Clone the repository:
```bash
git clone <your-repository-url>
cd personal-portfolio
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Setup Environment Variables:
Create a `.env` file in the root folder and add your Firebase and Cloudinary credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=ishakakadiya2005@gmail.com,ishakakdiya2005@gmail.com,ikakadiya36@gmail.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 4. Run the development server:
You can start the server by double-clicking the `run.bat` script (on Windows) or running:
```bash
npm run dev
```

---

## 🚀 Production Deployment (Netlify)

1. Connect your repository to Netlify.
2. Ensure the build configuration is set to:
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
3. Add your environment variables in Netlify under **Site Configuration > Environment variables**.
4. Register your live Netlify URL under the **Authorized Domains** section of your **Firebase Console > Authentication > Settings**.

---

## 👤 Author
* **Isha Kakadiya** — Data Science & Machine Learning Specialist
* **LinkedIn**: [https://www.linkedin.com/in/isha-kakadiya/](https://www.linkedin.com/in/isha-kakadiya/)
* **GitHub**: [https://github.com/Isha9656](https://github.com/Isha9656)
