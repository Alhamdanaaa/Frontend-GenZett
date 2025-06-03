# Gunakan base image Node.js
FROM node:18

# ARG dan ENV untuk NEXT_PUBLIC_ variabel jika Anda menggunakannya untuk CI/CD build args
# Contoh:
# ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Tambahkan ARG dan ENV lain yang relevan di sini

# Setel direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json untuk menginstal dependensi
COPY package.json package-lock.json ./

# Instal dependensi Node.js utama.
RUN npm install --legacy-peer-deps

# Salin sisa kode aplikasi Anda ke dalam container
COPY . .

# TAMBAHKAN LANGKAH INI:
# Secara eksplisit instal/pastikan modul native untuk platform linux-x64-gnu ada
# Gunakan --legacy-peer-deps jika diperlukan oleh paket-paket ini juga
# Opsi --no-save bisa digunakan jika Anda tidak ingin ini mengubah package-lock.json secara signifikan,
# tapi biasanya lebih baik membiarkannya agar lock file konsisten.
# Anda mungkin perlu mencari versi spesifik jika diperlukan, atau biarkan npm yang memilih.
RUN echo "Ensuring specific native modules are installed..." && \
    npm install --legacy-peer-deps \
        lightningcss-linux-x64-gnu \
        @tailwindcss/oxide-linux-x64-gnu \
        sass-embedded-linux-x64

# Jalankan proses build Next.js untuk produksi
RUN npm run build

# Ekspos port yang digunakan oleh aplikasi Next.js (defaultnya 3000)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["npm", "run", "start"]
