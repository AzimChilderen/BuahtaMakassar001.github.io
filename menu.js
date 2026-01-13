/**
 * DATABASE INITIALIZER
 * Memastikan data default masuk ke LocalStorage saat pertama kali dibuka
 */
const defaultBuah = [
    { nama: "Alpukat", sub: "Mentega Super", foto: "gambar/alpukat.jpg", varian: ["Mentega Super"], harga: [35000], tipe: "berat", fav: true },
    { nama: "Anggur", sub: "Red Globe / Muscat", foto: "gambar/anggur.jpg", varian: ["Red Globe", "Shine Muscat"], harga: [65000, 120000], tipe: "berat", fav: false },
    { nama: "Apel", sub: "Fuji Premium", foto: "gambar/apel.jpeg", varian: ["Apel Fuji", "Apel Malang"], harga: [45000, 30000], tipe: "berat", fav: false },
    { nama: "Buah Naga", sub: "Naga Merah Manis", foto: "gambar/buahnaga.jpg", varian: ["Naga Merah"], harga: [25000], tipe: "berat", fav: false },
    { nama: "Jeruk", sub: "Mandarin / Sunkist", foto: "gambar/jeruk.jpeg", varian: ["Mandarin", "Sunkist"], harga: [35000, 45000], tipe: "berat", fav: false },
    { nama: "Mangga", sub: "Arumanis Matang", foto: "gambar/mangga.jpeg", varian: ["Arumanis Super"], harga: [28000], tipe: "berat", fav: false },
    { nama: "Melon", sub: "Honey Globe", foto: "gambar/melon.jpg", varian: ["Melon Madu"], harga: [25000], tipe: "unit", fav: false },
    { nama: "Pir", sub: "Pir Century", foto: "gambar/pir.jpg", varian: ["Pir Century", "Pir Packham"], harga: [25000, 40000], tipe: "berat", fav: false },
    { nama: "Pisang", sub: "Sunpride / Raja", foto: "gambar/pisang.jpeg", varian: ["Sunpride", "Pisang Raja"], harga: [20000, 25000], tipe: "unit", fav: false },
    { nama: "Semangka", sub: "Tanpa Biji", foto: "gambar/semangka.jpeg", varian: ["Semangka Merah"], harga: [10000], tipe: "berat", fav: false },
    { nama: "Kurma", sub: "Sukari / Medjool", foto: "gambar/kurma.jpg", varian: ["Sukari 500gr", "Medjool 500gr"], harga: [55000, 120000], tipe: "unit", fav: false },
    { nama: "Salad Buah", sub: "Creamy Cheese", foto: "gambar/saladbuah.jpg", varian: ["Small Box", "Large Box"], harga: [15000, 35000], tipe: "unit", fav: true }
];

// Ambil data dari storage, jika tidak ada, pakai default
let dataMenu = JSON.parse(localStorage.getItem('produk_buah')) || defaultBuah;

// Jika baru pertama kali, simpan data default ke storage agar admin bisa baca
if (!localStorage.getItem('produk_buah')) {
    localStorage.setItem('produk_buah', JSON.stringify(defaultBuah));
}

/**
 * FUNGSI RENDER HALAMAN DEPAN
 */
function renderProduk() {
    const container = document.getElementById('product-container');
    if(!container) return;
    
    // Refresh data terbaru dari storage
    const currentData = JSON.parse(localStorage.getItem('produk_buah')) || defaultBuah;
    
    let html = "";
    currentData.forEach(b => {
        // Encode data agar aman di dalam atribut HTML
        const varStr = JSON.stringify(b.varian).replace(/"/g, '&quot;');
        const hrgStr = JSON.stringify(b.harga).replace(/"/g, '&quot;');
        
        html += `
        <div class="col">
            <div class="fruit-card ${b.fav ? 'border border-success shadow-sm' : ''}">
                <div class="img-container">
                    <img src="${b.foto}" onerror="this.src='https://placehold.co/400x300?text=Buah+Segar'">
                </div>
                <div class="p-3 text-center">
                    <h6 class="fw-bold mb-1">${b.nama}</h6>
                    <p class="text-muted small mb-3">${b.sub}</p>
                    <button class="btn btn-order w-100" onclick="openOrder('${b.nama}', ${varStr}, ${hrgStr}, '${b.tipe}')">Pilih</button>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProduk);