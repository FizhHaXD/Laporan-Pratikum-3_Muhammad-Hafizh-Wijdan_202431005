document.addEventListener('DOMContentLoaded', function() {
    // Ambil elemen-elemen input
    const inputs = {
        kehadiran: document.getElementById('kehadiran'),
        tugas: document.getElementById('tugas'),
        uts: document.getElementById('uts'),
        uas: document.getElementById('uas')
    };

    // Element untuk menampilkan live preview
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('button[name="proses"]');
    
    // Buat elemen preview nilai jika belum ada
    let livePreview = document.createElement('div');
    livePreview.id = 'live-preview';
    livePreview.className = 'mt-3 text-center fw-bold text-muted';
    livePreview.style.opacity = '0';
    livePreview.style.transition = 'opacity 0.3s';
    livePreview.innerHTML = 'Prediksi Nilai Akhir: -';
    
    // Sisipkan sebelum tombol submit
    const btnContainer = document.querySelector('.d-grid');
    btnContainer.parentNode.insertBefore(livePreview, btnContainer);

    // Fungsi untuk validasi input
    function validateInput(input) {
        let value = parseFloat(input.value);
        if (isNaN(value)) value = 0;

        if (value < 0) {
            input.value = 0;
            input.classList.add('is-invalid');
        } else if (value > 100) {
            input.value = 100;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    }

    // Fungsi hitung nilai
    function calculateGrade() {
        let absen = parseFloat(inputs.kehadiran.value) || 0;
        let tugas = parseFloat(inputs.tugas.value) || 0;
        let uts = parseFloat(inputs.uts.value) || 0;
        let uas = parseFloat(inputs.uas.value) || 0;

        // Pastikan range 0-100
        absen = Math.min(Math.max(absen, 0), 100);
        tugas = Math.min(Math.max(tugas, 0), 100);
        uts = Math.min(Math.max(uts, 0), 100);
        uas = Math.min(Math.max(uas, 0), 100);

        // Rumus: 10% Absen + 20% Tugas + 30% UTS + 40% UAS
        let nilaiAkhir = (absen * 0.10) + (tugas * 0.20) + (uts * 0.30) + (uas * 0.40);
        
        // Update text
        livePreview.innerHTML = `Prediksi Nilai Akhir: <span class="text-primary">${nilaiAkhir.toFixed(2)}</span>`;
        livePreview.style.opacity = '1';
    }

    // Pasang event listener
    for (let key in inputs) {
        const input = inputs[key];
        if (input) {
            input.addEventListener('input', function() {
                validateInput(this);
                calculateGrade();
            });
        }
    }
});
