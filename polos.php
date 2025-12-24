<?php
// Inisialisasi variabel default agar tidak error saat load pertama
$nilai_akhir = 0;
$grade = '';
$status_text = '';
$alert_class = '';
$card_header_class = 'bg-primary'; // Default Blue
$btn_class = 'btn-primary'; // Default Blue
$lulus = false;
$pesan_error = [];
$show_result = false;

// Cek apakah form disubmit
if (isset($_POST['proses'])) {
    $show_result = true;
    
    // Ambil data dari form
    $nama = $_POST['nama'];
    $nim = $_POST['nim'];
    $absen = floatval($_POST['kehadiran']);
    $tugas = floatval($_POST['tugas']);
    $uts = floatval($_POST['uts']);
    $uas = floatval($_POST['uas']);

    // Hitung Nilai Akhir
    $nilai_akhir = ($absen * 0.10) + ($tugas * 0.20) + ($uts * 0.30) + ($uas * 0.40);

    // Tentukan Grade
    if ($nilai_akhir >= 85) {
        $grade = 'A';
    } elseif ($nilai_akhir >= 70) {
        $grade = 'B';
    } elseif ($nilai_akhir >= 55) {
        $grade = 'C';
    } elseif ($nilai_akhir >= 40) {
        $grade = 'D';
    } else {
        $grade = 'E';
    }

    // Logika Kelulusan
    if ($absen <= 70) {
        $pesan_error[] = "Absen tidak memenuhi syarat (> 70).";
    }
    if ($tugas < 40 || $uts < 40 || $uas < 40) {
        $pesan_error[] = "Ada nilai komponen (Tugas/UTS/UAS) dibawah 40.";
    }

    if ($nilai_akhir >= 60 && $absen > 70 && $tugas >= 40 && $uts >= 40 && $uas >= 40) {
        $lulus = true;
        $status_text = "LULUS";
        $alert_class = "alert-success";
        $card_header_class = "bg-success"; // Green
        $btn_class = "btn-success";
    } else {
        $lulus = false;
        $status_text = "TIDAK LULUS";
        $alert_class = "alert-danger";
        $card_header_class = "bg-danger"; // Red
        $btn_class = "btn-danger";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penilaian Mahasiswa - Muhammad Hafizh Wijdan</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Link ke External CSS -->
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container mt-4 mb-5 px-5">
        <div class="card shadow-sm">
            <!-- Header Class dinamis dari PHP -->
            <div class="card-header text-center <?php echo $card_header_class; ?>">
                <h1 class="h4 mb-0">Form Penilaian Mahasiswa - Laporan Praktikum 3</h1>
                <p class="mb-0 mt-1 small">Muhammad Hafizh Wijdan | NIM: 202431005 | Kelas: Pemrograman Web E</p>
            </div>
            <div class="card-body">
                <form method="post">
                    <div class="mb-3">
                        <label for="nama" class="form-label">Masukkan Nama</label>
                        <input type="text" class="form-control" id="nama" name="nama" placeholder="Muhammad Hafizh Wijdan" value="<?php echo isset($_POST['nama']) ? htmlspecialchars($_POST['nama']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="nim" class="form-label">Masukkan NIM</label>
                        <input type="text" class="form-control" id="nim" name="nim" placeholder="202431005" value="<?php echo isset($_POST['nim']) ? htmlspecialchars($_POST['nim']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="kehadiran" class="form-label">Nilai Kehadiran (10%)</label>
                        <input type="number" class="form-control" id="kehadiran" name="kehadiran" placeholder="Untuk Lulus minimal 70%" min="0" max="100" value="<?php echo isset($_POST['kehadiran']) ? htmlspecialchars($_POST['kehadiran']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="tugas" class="form-label">Nilai Tugas (20%)</label>
                        <input type="number" class="form-control" id="tugas" name="tugas" placeholder="0 - 100" min="0" max="100" value="<?php echo isset($_POST['tugas']) ? htmlspecialchars($_POST['tugas']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="uts" class="form-label">Nilai UTS (30%)</label>
                        <input type="number" class="form-control" id="uts" name="uts" placeholder="0 - 100" min="0" max="100" value="<?php echo isset($_POST['uts']) ? htmlspecialchars($_POST['uts']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="uas" class="form-label">Nilai UAS (40%)</label>
                        <input type="number" class="form-control" id="uas" name="uas" placeholder="0 - 100" min="0" max="100" value="<?php echo isset($_POST['uas']) ? htmlspecialchars($_POST['uas']) : ''; ?>">
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" name="proses" class="btn <?php echo $btn_class; ?>">Proses</button>
                    </div>
                </form>

                <?php
                if ($show_result) {
                ?>
                    <!-- Hasil Penilaian -->
                    <div class="alert <?php echo $alert_class; ?> mt-4" role="alert">
                        <h4 class="alert-heading">Hasil Penilaian</h4>
                        <p>
                            <strong>Nama:</strong> <?php echo htmlspecialchars($nama); ?> <br>
                            <strong>NIM:</strong> <?php echo htmlspecialchars($nim); ?> <br>
                            <strong>Nilai Akhir:</strong> <?php echo number_format($nilai_akhir, 2); ?> <br>
                            <strong>Grade:</strong> <?php echo $grade; ?> <br>
                            <strong>Status:</strong> <?php echo $status_text; ?>
                        </p>
                        <?php if (!empty($pesan_error)) : ?>
                            <hr>
                            <p class="mb-0 small text-muted">
                                Catatan: <?php echo implode(' ', $pesan_error); ?>
                            </p>
                        <?php endif; ?>
                    </div>
                <?php
                }
                ?>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>