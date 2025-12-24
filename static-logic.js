document.addEventListener('DOMContentLoaded', function() {
    // Re-use the live calculation logic from script.js inside here or just merge them.
    // Since we are replacing the PHP logic entirely, we will implement everything here.
    
    const form = document.getElementById('gradingForm');
    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');
    const btnProses = document.getElementById('btn-proses');
    const cardHeader = document.getElementById('card-header');

    // Inputs
    const inputs = {
        nama: document.getElementById('nama'),
        nim: document.getElementById('nim'),
        kehadiran: document.getElementById('kehadiran'),
        tugas: document.getElementById('tugas'),
        uts: document.getElementById('uts'),
        uas: document.getElementById('uas')
    };

    // Live Calculation / Validation (Same as script.js feature)
    let livePreview = document.createElement('div');
    livePreview.id = 'live-preview';
    livePreview.className = 'mt-3 text-center fw-bold text-muted';
    livePreview.style.opacity = '0';
    livePreview.innerHTML = 'Prediksi Nilai Akhir: -';
    const btnContainer = document.querySelector('.d-grid');
    btnContainer.parentNode.insertBefore(livePreview, btnContainer);

    function validateInput(input) {
        let value = parseFloat(input.value);
        if (isNaN(value)) value = 0; // Default to 0 for validation logic if empty

        // Remove invalid class first
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');

        // Only mark invalid if out of range, but here we can just clamp or warn
        if (value < 0 || value > 100) {
            input.classList.add('is-invalid');
        } else if (input.value !== '') {
            input.classList.add('is-valid');
        }
    }

    function calculateLive() {
        let absen = parseFloat(inputs.kehadiran.value) || 0;
        let tugas = parseFloat(inputs.tugas.value) || 0;
        let uts = parseFloat(inputs.uts.value) || 0;
        let uas = parseFloat(inputs.uas.value) || 0;

        absen = Math.min(Math.max(absen, 0), 100);
        tugas = Math.min(Math.max(tugas, 0), 100);
        uts = Math.min(Math.max(uts, 0), 100);
        uas = Math.min(Math.max(uas, 0), 100);

        let nilaiAkhir = (absen * 0.10) + (tugas * 0.20) + (uts * 0.30) + (uas * 0.40);
        livePreview.innerHTML = `Prediksi Nilai Akhir: <span class="text-primary">${nilaiAkhir.toFixed(2)}</span>`;
        livePreview.style.opacity = '1';
        return nilaiAkhir;
    }

    ['kehadiran', 'tugas', 'uts', 'uas'].forEach(key => {
        inputs[key].addEventListener('input', function() {
            validateInput(this);
            calculateLive();
        });
    });

    // Form Submission Logic (Replacing PHP)
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent reload

        // Get Values
        const nama = inputs.nama.value;
        const nim = inputs.nim.value;
        let absen = parseFloat(inputs.kehadiran.value) || 0;
        let tugas = parseFloat(inputs.tugas.value) || 0;
        let uts = parseFloat(inputs.uts.value) || 0;
        let uas = parseFloat(inputs.uas.value) || 0;

        // Calculate Final Score
        // Validation: clamp values for calculation roughly, or take raw if we want to show strict errors.
        // The PHP logic didn't clamp, but we should assume valid inputs here for calculation.
        let nilaiAkhir = (absen * 0.10) + (tugas * 0.20) + (uts * 0.30) + (uas * 0.40);

        // Grade Logic
        let grade = '';
        if (nilaiAkhir >= 85) grade = 'A';
        else if (nilaiAkhir >= 70) grade = 'B';
        else if (nilaiAkhir >= 55) grade = 'C';
        else if (nilaiAkhir >= 40) grade = 'D';
        else grade = 'E';

        // Lulus Logic & Errors
        let pesanError = [];
        if (absen <= 70) pesanError.push("Absen tidak memenuhi syarat (> 70).");
        if (tugas < 40 || uts < 40 || uas < 40) pesanError.push("Ada nilai komponen (Tugas/UTS/UAS) dibawah 40.");

        let lulus = false;
        if (nilaiAkhir >= 60 && absen > 70 && tugas >= 40 && uts >= 40 && uas >= 40) {
            lulus = true;
        }

        // Update UI
        document.getElementById('res-nama').textContent = nama;
        document.getElementById('res-nim').textContent = nim;
        document.getElementById('res-nilai').textContent = nilaiAkhir.toFixed(2);
        document.getElementById('res-grade').textContent = grade;
        
        // Remove old classes
        resultContainer.className = 'alert mt-4';
        cardHeader.className = 'card-header text-center';
        btnProses.className = 'btn';

        if (lulus) {
            document.getElementById('res-status').textContent = "LULUS";
            resultContainer.classList.add('alert-success');
            cardHeader.classList.add('bg-success'); // Green
            btnProses.classList.add('btn-success');
        } else {
            document.getElementById('res-status').textContent = "TIDAK LULUS";
            resultContainer.classList.add('alert-danger');
            cardHeader.classList.add('bg-danger'); // Red
            btnProses.classList.add('btn-danger');
            
            // Revert background to red if not passed, but check if we need to keep standard blue if no error?
            // The PHP logic said: bg-danger if not lulus (technically else block)
        }

        // Errors/Notes
        if (pesanError.length > 0) {
            document.getElementById('res-catatan').textContent = pesanError.join(' ');
            errorContainer.classList.remove('d-none');
        } else {
            errorContainer.classList.add('d-none');
        }

        resultContainer.classList.remove('d-none');
    });
});
