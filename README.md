# **Frontend-GenZett**  
# **Sport Center Reservation - Frontend**  

## 🔹 Identitas Kelompok 4 | GenZett
| Nama | NIM / No. Absen |
|-----------------------------|----------------|
| Alhamdana Fariz Al Furqaan | 2241720115 / 03 |
| Diva Aji Kurniawan | 2241720183 / 06 |
| Febrianti Mayori | 2241720248 / 07 |
| Filla Ramadhani Utomo | 2241720209 / 09 |
| Mochammad Nizar Mahi | 2241720185 / 13 |

## **Deskripsi Proyek**  
Ini adalah bagian frontend untuk sistem reservasi lapangan olahraga menggunakan **Next.js** dan **ShadCN UI**. Proyek ini terhubung dengan backend di repository terpisah.  

## **Cara Menjalankan Proyek**  

### **1. Clone Repository**  
Pertama, clone repository ke komputer lokal:  
```bash
git clone https://github.com/Alhamdanaaa/Frontend-GenZett.git
cd Frontend-GenZett
```

### **2. Install Dependencies**  
Jalankan perintah berikut untuk menginstal dependencies:  
```bash
npm install
```

### **3. Menjalankan Aplikasi**  
Untuk menjalankan aplikasi secara lokal, gunakan perintah berikut:  
```bash
npm run dev
```
Aplikasi akan tersedia di [http://localhost:3000](http://localhost:3000).

---

## **Pengaturan Git & Branching**  

### **4. Setup Git & Membuat Branch Baru**  
Sebelum mulai bekerja pada fitur atau perbaikan tertentu, buat branch baru berdasarkan `development`.  

1. **Pastikan kamu sudah mengatur Git dengan benar** (dengan nama dan email GitHub yang sesuai):  
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

2. **Periksa status branch** untuk memastikan kamu berada di branch `development` atau `main`:  
   ```bash
   git branch
   ```

3. **Checkout branch `development`** dan pastikan kamu update branch tersebut dengan perubahan terbaru:  
   ```bash
   git checkout development
   git pull origin development
   ```

4. **Buat branch baru** berdasarkan `development`:  
   ```bash
   git checkout -b nama-branch-anda
   ```
   Misalnya, untuk fitur "manajemen-reservasi":  
   ```bash
   git checkout -b fitur-manajemen-reservasi
   ```

5. **Push branch baru ke remote**:  
   ```bash
   git push origin nama-branch-anda
   ```

---

### **5. Mengubah Kode & Commit Perubahan**  
Setelah mengubah kode (misalnya, menambahkan fitur baru atau memperbaiki bug):  

1. **Menambahkan perubahan ke staging area**:  
   ```bash
   git add .
   ```

2. **Membuat commit dengan pesan yang jelas**:  
   ```bash
   git commit -m "Deskripsi perubahan atau fitur yang ditambahkan"
   ```

3. **Push perubahan ke branch remote**:  
   ```bash
   git push origin nama-branch-anda
   ```

---

### **6. Membuat Pull Request**  

Setelah kamu selesai dengan fitur yang dikerjakan dan ingin menggabungkannya dengan `development`:  

1. Pergi ke repository GitHub dan buka **branch yang telah kamu buat**.  
2. Klik tombol **"Compare & Pull Request"** untuk membuat pull request ke branch `development`.  
3. Pastikan bahwa kamu melakukan pull request **ke branch `development`** dan bukan `main`.  
4. Tambahkan deskripsi singkat tentang perubahan yang kamu buat, lalu klik **"Create Pull Request"**.  
5. **Review** oleh anggota tim lain akan dilakukan di branch `development`. Jika sudah disetujui, baru pull request tersebut akan di-merge.  

---

### **7. Merge ke `main`**  
Setelah fitur yang ada di branch `development` stabil dan siap dirilis:  

1. **Update branch `development` terlebih dahulu** untuk memastikan tidak ada konflik:  
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Merge branch `development` ke `main`**:  
   ```bash
   git checkout main
   git pull origin main
   git merge development
   ```

3. **Push perubahan ke branch `main`**:  
   ```bash
   git push origin main
   ```

---

## **Kolaborasi Tim**  

- Pastikan untuk **update branch** setiap kali ada perubahan dari anggota tim lain:  
  ```bash
  git pull origin development
  ```
- **Gunakan nama branch yang deskriptif** untuk masing-masing fitur atau perbaikan yang sedang dikerjakan.  

---

## **Bantuan**  
Jika mengalami kesulitan atau membutuhkan bantuan lebih lanjut, silakan hubungi rekan tim atau buka **issues** di GitHub repository.  

---

## **Dokumentasi & Sumber Daya**  
Berikut adalah link dokumentasi untuk framework dan library yang digunakan dalam proyek ini:  

- **[Next.js Documentation](https://nextjs.org/docs)**  
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)**  
- **[ShadCN UI Documentation](https://ui.shadcn.dev/docs)**  

---
