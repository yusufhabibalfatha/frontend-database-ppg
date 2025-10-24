import * as XLSX from 'xlsx';

// Fungsi untuk menghitung umur (sama seperti di component)
const calculateAge = (tanggalLahir) => {
  if (!tanggalLahir) return 0;
  
  const birthDate = new Date(tanggalLahir);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Format data generus untuk export
export const formatGenerusForExport = (generusData) => {
  return generusData.map(item => ({
    'ID': item.id || '',
    'Nama Lengkap': item.nama_lengkap || '',
    'Nama Panggilan': item.nama_panggilan || '',
    'Jenis Kelamin': item.jenis_kelamin || '',
    'Tempat Lahir': item.tempat_lahir || '',
    'Tanggal Lahir': item.tanggal_lahir ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID') : '',
    'Umur': item.tanggal_lahir ? calculateAge(item.tanggal_lahir) : '',
    'Golongan Darah': item.golongan_darah || '',
    'Jumlah Saudara': item.jumlah_saudara || '',
    'Anak Ke': item.anak_ke_berapa || '',
    'Riwayat Penyakit': item.riwayat_penyakit || '',
    
    // Data Orang Tua
    'Nama Ayah': item.nama_ayah || '',
    'Pekerjaan Ayah': item.pekerjaan_ayah || '',
    'Pendidikan Ayah': item.pendidikan_terakhir_ayah || '',
    'Nama Ibu': item.nama_ibu || '',
    'Pekerjaan Ibu': item.pekerjaan_ibu || '',
    'Pendidikan Ibu': item.pendidikan_terakhir_ibu || '',
    
    // Alamat
    'Jalan': item.jalan || '',
    'RT': item.rt || '',
    'RW': item.rw || '',
    'Kelurahan': item.kelurahan || '',
    'Kecamatan': item.kecamatan || '',
    'Desa': item.desa || '',
    'Kelompok': item.kelompok || '',
    
    // Pendidikan & Minat
    'Jenjang Pendidikan': item.jenjang_pendidikan || '',
    'Nama Sekolah': item.nama_sekolah || '',
    'Jenjang Pembinaan': item.jenjang_pembinaan || '',
    'Hobi': Array.isArray(item.hobi) ? item.hobi.join(', ') : item.hobi || '',
    'Minat': Array.isArray(item.minat) ? item.minat.join(', ') : item.minat || '',
    'Cita-cita': Array.isArray(item.cita_cita) ? item.cita_cita.join(', ') : item.cita_cita || '',
    'Prestasi': Array.isArray(item.prestasi) ? item.prestasi.join(', ') : item.prestasi || '',
    'Kejuaraan': Array.isArray(item.kejuaraan) ? item.kejuaraan.join(', ') : item.kejuaraan || '',
    'Keahlian': item.keahlian || '',
    'No. HP': Array.isArray(item.no_hp) ? item.no_hp.join(', ') : item.no_hp || '',
  }));
};

// Fungsi utama export ke Excel
export const exportToExcel = (data, filename = 'data-generus') => {
  try {
    // Buat worksheet dari data
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Atur lebar kolom otomatis
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      )
    }));
    
    ws['!cols'] = colWidths;
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Generus");
    
    // Export ke file Excel
    XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

// Export data statistik
export const exportStatisticsToExcel = (statistics, filename = 'statistik-generus') => {
  try {
    const statData = [
      { 'Kategori': 'Total Generus', 'Jumlah': statistics.total || 0 },
      { 'Kategori': 'Laki-laki', 'Jumlah': statistics.gender?.['Laki-laki'] || 0 },
      { 'Kategori': 'Perempuan', 'Jumlah': statistics.gender?.['Perempuan'] || 0 },
    ];

    // Tambahkan data pembinaan
    Object.entries(statistics.pembinaan || {}).forEach(([key, value]) => {
      statData.push({ 'Kategori': `Pembinaan - ${key}`, 'Jumlah': value });
    });

    // Tambahkan data pendidikan
    Object.entries(statistics.pendidikan || {}).forEach(([key, value]) => {
      statData.push({ 'Kategori': `Pendidikan - ${key}`, 'Jumlah': value });
    });

    const ws = XLSX.utils.json_to_sheet(statData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistik");
    
    XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting statistics:', error);
    return false;
  }
};