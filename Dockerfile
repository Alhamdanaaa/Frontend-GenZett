genzett@ReSports-FE:~/Frontend-GenZett$ cat Dockerfile
# Gunakan base image Node.js
FROM node:18

# Setel direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json untuk menginstal dependensi
# Ini membantu memanfaatkan cache Docker jika dependensi tidak berubah
COPY package.json package-lock.json ./

# Instal dependensi Node.js.
# --legacy-peer-deps mungkin diperlukan untuk versi npm tertentu atau konfigurasi proyek
RUN npm install --legacy-peer-deps

# Salin sisa kode aplikasi Anda ke dalam container
COPY . .

# Jalankan proses build Next.js untuk produksi
RUN npm run build

# Ekspos port yang digunakan oleh aplikasi Next.js (defaultnya 3000)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["npm", "run", "start"]
