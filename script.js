let cart = [];
let tempItem = {};

// Membuka Modal Pilihan Buah
window.openOrder = function(name, variants, prices, type) {
    tempItem = { name, variants, prices, type };
    
    const modalName = document.getElementById('m_name');
    const vSelect = document.getElementById('m_variant');
    
    if(modalName) modalName.innerText = name;
    
    if(vSelect) {
        vSelect.innerHTML = variants.map((v, i) => 
            `<option value="${v}" data-price="${prices[i]}">${v} (Rp ${prices[i].toLocaleString()})</option>`
        ).join('');
    }

    // Tampilkan box berat (kg) atau qty (unit)
    document.getElementById('m_weight_box').classList.toggle('d-none', type !== 'berat');
    document.getElementById('m_qty_box').classList.toggle('d-none', type !== 'unit');
    
    calculateLivePrice();
    
    const myModal = new bootstrap.Modal(document.getElementById('orderModal'));
    myModal.show();
};

// Hitung Harga Otomatis saat ganti varian/jumlah
window.calculateLivePrice = function() {
    const vSelect = document.getElementById('m_variant');
    const display = document.getElementById('live-price-text');
    if (!vSelect || !display) return;

    const price = parseInt(vSelect.selectedOptions[0].dataset.price);
    let qty = (tempItem.type === 'berat') ? 
              parseFloat(document.getElementById('m_weight').value) : 
              parseInt(document.getElementById('m_qty').value);

    const total = price * qty;
    display.innerText = `Rp ${total.toLocaleString('id-ID')}`;
};

// Tambah ke Keranjang
window.addToCart = function() {
    const vSelect = document.getElementById('m_variant');
    const price = parseInt(vSelect.selectedOptions[0].dataset.price);
    let qty, label;
    
    if (tempItem.type === 'berat') {
        qty = parseFloat(document.getElementById('m_weight').value);
        label = qty >= 1 ? qty + ' kg' : (qty * 1000) + ' gr';
    } else {
        qty = parseInt(document.getElementById('m_qty').value);
        label = qty + ' unit';
    }

    cart.push({
        desc: `${tempItem.name} (${vSelect.value})`,
        label: label,
        sub: price * qty
    });

    // Tutup Modal
    const modalEl = document.getElementById('orderModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if(modalInstance) modalInstance.hide();
    
    renderCartBar();
};

// Tampilkan Bar Hijau di bawah
window.renderCartBar = function() {
    const total = cart.reduce((s, i) => s + i.sub, 0);
    const bar = document.getElementById('cart-bar');
    if(cart.length > 0) {
        bar.style.display = 'flex';
        document.getElementById('cart-count').innerText = `${cart.length} Item`;
        document.getElementById('cart-total-display').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    } else {
        bar.style.display = 'none';
    }
};

// Buka Ringkasan Belanja
window.openCheckout = function() {
    let total = cart.reduce((s, i) => s + i.sub, 0);
    const list = document.getElementById('checkout-list');
    
    list.innerHTML = cart.map((item, index) => `
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            <div>
                <div class="fw-bold small">${item.desc}</div>
                <div class="text-muted small">${item.label} - Rp ${item.sub.toLocaleString()}</div>
            </div>
            <button class="btn btn-sm text-danger" onclick="removeItem(${index})"><i class="bi bi-trash"></i></button>
        </div>
    `).join('') || "Keranjang Kosong";
    
    document.getElementById('final-total').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    renderCartBar();
    openCheckout();
};

// Kirim ke WhatsApp
window.sendToWA = function() {
    const name = document.getElementById('c_name').value;
    const note = document.getElementById('c_note').value;
    
    if(!name) return alert("Mohon isi nama Anda");
    if(cart.length === 0) return alert("Keranjang masih kosong");

    let listText = cart.map((i, idx) => `${idx+1}. *${i.desc}* (${i.label}) = Rp ${i.sub.toLocaleString()}`).join('%0A');
    let grandTotal = cart.reduce((s, i) => s + i.sub, 0);
    
    const text = `*PESANAN BUAHTA.MAKASSAR*%0A%0A*Nama:* ${name}%0A*Catatan:* ${note || '-'}%0A%0A*Daftar Pesanan:*%0A${listText}%0A%0A*Total: Rp ${grandTotal.toLocaleString()}*%0A%0A Mohon segera diproses kak!`;
    
    window.open(`https://wa.me/6282398124858?text=${text}`);
};