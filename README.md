# Tabunganku (PWA)

    npm install
    # buat ikon PNG dari public/icon.svg → public/icon-192.png & icon-512.png
    npx pwa-asset-generator public/icon.svg public --icon-only --type png   # atau tool lain
    npm run dev
    npm run build && npm start   # uji PWA/A2HS (butuh HTTPS atau localhost)
    npm run test:e2e

Deploy: Vercel (`vercel --prod`) — HTTPS otomatis, syarat A2HS terpenuhi.
Data disimpan di localStorage perangkat (tanpa backend).
