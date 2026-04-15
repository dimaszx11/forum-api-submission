# Forum API Submission

Backend Forum API untuk submission Dicoding menggunakan Express, PostgreSQL, Clean Architecture, unit test, integration test, dan server test dasar.

## Fitur
- Registrasi pengguna
- Login
- Refresh access token
- Logout
- Tambah thread
- Detail thread
- Tambah komentar
- Hapus komentar (soft delete)

## Menjalankan
1. Salin `.env.example` menjadi `.env`
2. Buat database PostgreSQL untuk development dan test
3. Jalankan:
   - `npm install`
   - `npm run migrate`
   - `npm run test`
   - `npm start`

## Catatan
- Gunakan Node.js LTS terbaru.
- Untuk test, pastikan `PGDATABASE_TEST` sudah dibuat dan migrasi test sudah dijalankan.
