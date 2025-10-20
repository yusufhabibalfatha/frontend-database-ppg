import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import "./PageHome.css";

function PageHome() {
  const { showNotification } = useContext(NotificationContext);
  const { auth } = useAuth();
  const [generus, setGenerus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/generus/${id}`);
  };

  // Fungsi untuk menghitung umur
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

  // Urutan pendidikan yang benar
  const pendidikanOrder = [
    'TK', 'TK 1', 'TK 2', 'TK 3',
    'SD 1', 'SD 2', 'SD 3', 'SD 4', 'SD 5', 'SD 6',
    'SMP 1', 'SMP 2', 'SMP 3',
    'SMA 1', 'SMA 2', 'SMA 3', 'SMK 1', 'SMK 2', 'SMK 3',
    'KULIAH', 'BEKERJA', 'BELUM BEKERJA', 'TIDAK SEKOLAH'
  ];

  // Fungsi untuk membersihkan dan normalisasi data pendidikan
  const cleanPendidikanData = (pendidikan) => {
    if (!pendidikan) return 'BELUM DIISI';
    
    // Convert to string and uppercase
    const cleaned = pendidikan.toString().toUpperCase().trim();
    
    // Handle common variations
    if (cleaned === '' || cleaned === 'NULL' || cleaned === 'UNDEFINED') {
      return 'BELUM DIISI';
    }
    
    return cleaned;
  };

  // Fungsi untuk menghitung statistik dengan urutan yang benar
  const calculateStatistics = (data = generus) => {
    const stats = {
      total: data.length,
      pembinaan: {},
      pendidikan: {},
      gender: {
        'Laki-laki': 0,
        'Perempuan': 0
      }
    };

    data.forEach(item => {
      // Hitung berdasarkan jenjang pembinaan (dengan handling null)
      const pembinaan = item.jenjang_pembinaan || 'BELUM DIISI';
      stats.pembinaan[pembinaan] = (stats.pembinaan[pembinaan] || 0) + 1;
      
      // Hitung berdasarkan jenjang pendidikan (dengan normalisasi dan handling null)
      const pendidikan = cleanPendidikanData(item.jenjang_pendidikan);
      stats.pendidikan[pendidikan] = (stats.pendidikan[pendidikan] || 0) + 1;
      
      // Hitung berdasarkan jenis kelamin (dengan handling null)
      const gender = item.jenis_kelamin || 'BELUM DIISI';
      stats.gender[gender] = (stats.gender[gender] || 0) + 1;
    });

    // Urutkan pendidikan sesuai urutan yang ditentukan
    const sortedPendidikan = {};
    pendidikanOrder.forEach(key => {
      const upperKey = key.toUpperCase();
      if (stats.pendidikan[upperKey]) {
        sortedPendidikan[key] = stats.pendidikan[upperKey];
      }
    });

    // Tambahkan pendidikan lain yang tidak ada di urutan
    Object.keys(stats.pendidikan).forEach(key => {
      const normalizedKey = key.toUpperCase();
      if (!pendidikanOrder.some(p => p.toUpperCase() === normalizedKey)) {
        sortedPendidikan[key] = stats.pendidikan[key];
      }
    });

    stats.pendidikan = sortedPendidikan;

    return stats;
  };

  // Fungsi untuk menghitung statistik per kelompok (untuk admin)
  const calculateKelompokStats = () => {
    const kelompokStats = {};
    
    generus.forEach(item => {
      const kelompok = item.kelompok || 'TANPA KELOMPOK';
      
      if (!kelompokStats[kelompok]) {
        kelompokStats[kelompok] = {
          total: 0,
          gender: { 'Laki-laki': 0, 'Perempuan': 0, 'BELUM DIISI': 0 },
          pembinaan: {},
          generusList: []
        };
      }
      
      kelompokStats[kelompok].total++;
      
      // Handle gender data
      const gender = item.jenis_kelamin || 'BELUM DIISI';
      kelompokStats[kelompok].gender[gender] = (kelompokStats[kelompok].gender[gender] || 0) + 1;
      
      // Handle pembinaan data
      const pembinaan = item.jenjang_pembinaan || 'BELUM DIISI';
      kelompokStats[kelompok].pembinaan[pembinaan] = 
        (kelompokStats[kelompok].pembinaan[pembinaan] || 0) + 1;
      
      kelompokStats[kelompok].generusList.push(item);
    });
    
    return kelompokStats;
  };

  const statistics = calculateStatistics();
  const kelompokStats = calculateKelompokStats();

  // Filter data untuk subscriber berdasarkan kelompok mereka
  const filteredGenerus = auth?.role?.includes("subscriber") 
    ? generus.filter(item => item.kelompok === auth?.kelompok)
    : generus;

  const openKelompokModal = (kelompok) => {
    setSelectedKelompok(kelompok);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedKelompok(null);
  };

  useEffect(() => {
    const apiUrl = `${
      import.meta.env.VITE_API_URL || "http://ppg-generus.local/wp-json"
    }/db/generus/all?_=${new Date().getTime()}`;
    
    const token = localStorage.getItem("adminToken");

    const fetchGenerus = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Log data untuk debugging
        console.log('Data generus dari API:', response.data);
        
        // Filter out null items and log problematic data
        const validData = response.data.filter(item => {
          if (!item) {
            console.warn('Null item ditemukan:', item);
            return false;
          }
          return true;
        });
        
        setGenerus(validData);
      } catch (error) {
        console.error('Error fetching generus:', error);
        showNotification("Gagal mengambil data generus.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerus();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Memuat data generus...</p>
      </div>
    );
  }

  // TAMPILAN UNTUK SUBSCRIBER/KELOMPOK
  if (auth?.role?.includes("subscriber")) {
    const subscriberStats = calculateStatistics(filteredGenerus);
    
    return (
      <div className="page-home">
        <div className="page-header">
          <h1 className="page-title">📊 Daftar Generus</h1>
          
          <div className="user-info subscriber">
            <p>👥 Kelas Generus - {auth?.kelompok}</p>
          </div>
        </div>

        {/* Statistics Section */}
        {filteredGenerus.length > 0 && (
          <div className="statistics-section">
            <h2 className="statistics-title">📈 Statistik Generus - {auth?.kelompok}</h2>
            
            <div className="statistics-grid">
              {/* Total Generus */}
              <div className="stat-card total">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3 className="stat-value">{subscriberStats.total}</h3>
                  <p className="stat-label">Total Generus</p>
                </div>
              </div>

              {/* Jenjang Pembinaan */}
              <div className="stat-card pembinaan">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3 className="stat-value">{Object.keys(subscriberStats.pembinaan).length}</h3>
                  <p className="stat-label">Jenjang Pembinaan</p>
                  <div className="stat-details">
                    {Object.entries(subscriberStats.pembinaan).map(([key, value]) => (
                      <div key={key} className="stat-detail-row">
                        <span className="stat-detail-label">{key}</span>
                        <span className="stat-detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Jenjang Pendidikan */}
              <div className="stat-card pendidikan">
                <div className="stat-icon">🎓</div>
                <div className="stat-content">
                  <h3 className="stat-value">{Object.keys(subscriberStats.pendidikan).length}</h3>
                  <p className="stat-label">Jenjang Pendidikan</p>
                  <div className="stat-details">
                    {Object.entries(subscriberStats.pendidikan).map(([key, value]) => (
                      <div key={key} className="stat-detail-row">
                        <span className="stat-detail-label">{key}</span>
                        <span className="stat-detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div className="stat-card gender">
                <div className="stat-icon">👦👧</div>
                <div className="stat-content">
                  <h3 className="stat-value">{subscriberStats.gender['Laki-laki'] + subscriberStats.gender['Perempuan']}</h3>
                  <p className="stat-label">Jenis Kelamin</p>
                  <div className="stat-details">
                    <div className="stat-detail-row">
                      <span className="stat-detail-label">👦 Laki-laki</span>
                      <span className="stat-detail-value">{subscriberStats.gender['Laki-laki']}</span>
                    </div>
                    <div className="stat-detail-row">
                      <span className="stat-detail-label">👧 Perempuan</span>
                      <span className="stat-detail-value">{subscriberStats.gender['Perempuan']}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Divider antara Statistik dan List Generus */}
        {filteredGenerus.length > 0 && (
          <div className="section-divider">
            <div className="divider-line"></div>
            <h2 className="section-title">📋 Daftar Lengkap Generus</h2>
            <div className="divider-line"></div>
          </div>
        )}
        
        {filteredGenerus.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-text">Tidak ada data generus</p>
            <p className="empty-subtext">Data generus akan muncul di sini setelah ditambahkan</p>
          </div>
        ) : (
          <div className="generus-list">
            {filteredGenerus.map((item) => (
              <div key={item.id} className="generus-card" onClick={() => goToDetail(item.id)}>
                <div className="generus-header">
                  <h3 className="generus-name">{item.nama_lengkap || 'Nama belum diisi'}</h3>
                  <span className={`gender-badge ${item.jenis_kelamin === 'Perempuan' ? 'female' : ''}`}>
                    {item.jenis_kelamin === 'Laki-laki' ? '👦' : '👧'} {item.jenis_kelamin || 'Belum diisi'}
                  </span>
                </div>
                
                <div className="generus-details">
                  <div className="detail-item">
                    <span className="detail-icon">🎓</span>
                    <span>Pendidikan: {item.jenjang_pendidikan || 'Belum diisi'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>TTL: {item.tempat_lahir || 'Tempat lahir'}, {item.tanggal_lahir ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID') : 'Tanggal lahir'} {item.tanggal_lahir && `(${calculateAge(item.tanggal_lahir)} tahun)`}</span>
                  </div>
                </div>
                
                <div className="detail-badges">
                  <span className="detail-badge">📚 {item.jenjang_pembinaan || 'Belum diisi'}</span>
                </div>
                
                <button className="detail-button" onClick={() => goToDetail(item.id)}>
                  👀 Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // TAMPILAN UNTUK ADMIN
  return (
    <div className="page-home">
      <div className="page-header">
        <h1 className="page-title">🏢 Dashboard Admin</h1>
        
        <div className="user-info admin">
          <p>👨‍💼 Admin Panel - Overview Semua Kelompok</p>
        </div>
      </div>

      {/* Total Overview */}
      <div className="admin-overview">
        <div className="overview-card total">
          <div className="overview-icon">👥</div>
          <div className="overview-content">
            <h3 className="overview-value">{generus.length}</h3>
            <p className="overview-label">Total Semua Generus</p>
          </div>
        </div>
        
        <div className="overview-card kelompok">
          <div className="overview-icon">🏘️</div>
          <div className="overview-content">
            <h3 className="overview-value">{Object.keys(kelompokStats).length}</h3>
            <p className="overview-label">Total Kelompok</p>
          </div>
        </div>
      </div>

      {/* Kelompok List */}
      <div className="kelompok-section">
        <h2 className="section-title">📊 Data Per Kelompok</h2>
        
        {Object.keys(kelompokStats).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏘️</div>
            <p className="empty-text">Tidak ada data kelompok</p>
            <p className="empty-subtext">Data kelompok akan muncul di sini setelah data generus ditambahkan</p>
          </div>
        ) : (
          <div className="kelompok-grid">
            {Object.entries(kelompokStats).map(([kelompok, stats]) => (
              <div 
                key={kelompok} 
                className="kelompok-card"
                onClick={() => openKelompokModal(kelompok)}
              >
                <div className="kelompok-header">
                  <h3 className="kelompok-name">🕌 {kelompok}</h3>
                  <span className="kelompok-badge">{stats.total} Generus</span>
                </div>
                
                <div className="kelompok-stats">
                  <div className="kelompok-stat">
                    <span className="stat-label">👦 Laki:</span>
                    <span className="stat-value">{stats.gender['Laki-laki'] || 0}</span>
                  </div>
                  <div className="kelompok-stat">
                    <span className="stat-label">👧 Perempuan:</span>
                    <span className="stat-value">{stats.gender['Perempuan'] || 0}</span>
                  </div>
                  <div className="kelompok-stat">
                    <span className="stat-label">📚 Jenjang:</span>
                    <span className="stat-value">{Object.keys(stats.pembinaan).length}</span>
                  </div>
                </div>
                
                <button className="kelompok-button">
                  📋 Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal untuk Detail Kelompok */}
      {showModal && selectedKelompok && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📊 Detail Kelompok - {selectedKelompok}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            
            <div className="modal-body">
              {/* Statistik Kelompok dalam Modal */}
              <div className="modal-statistics">
                <h3 className="modal-subtitle">📈 Statistik Kelompok</h3>
                <div className="statistics-grid modal-grid">
                  <div className="stat-card total">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{kelompokStats[selectedKelompok].total}</h3>
                      <p className="stat-label">Total Generus</p>
                    </div>
                  </div>

                  <div className="stat-card gender">
                    <div className="stat-icon">👦👧</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{(kelompokStats[selectedKelompok].gender['Laki-laki'] || 0) + (kelompokStats[selectedKelompok].gender['Perempuan'] || 0)}</h3>
                      <p className="stat-label">Jenis Kelamin</p>
                      <div className="stat-details">
                        <div className="stat-detail-row">
                          <span className="stat-detail-label">👦 Laki-laki</span>
                          <span className="stat-detail-value">{kelompokStats[selectedKelompok].gender['Laki-laki'] || 0}</span>
                        </div>
                        <div className="stat-detail-row">
                          <span className="stat-detail-label">👧 Perempuan</span>
                          <span className="stat-detail-value">{kelompokStats[selectedKelompok].gender['Perempuan'] || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card pembinaan">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{Object.keys(kelompokStats[selectedKelompok].pembinaan).length}</h3>
                      <p className="stat-label">Jenjang Pembinaan</p>
                      <div className="stat-details">
                        {Object.entries(kelompokStats[selectedKelompok].pembinaan).map(([key, value]) => (
                          <div key={key} className="stat-detail-row">
                            <span className="stat-detail-label">{key}</span>
                            <span className="stat-detail-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Generus dalam Modal */}
              <div className="modal-generus-list">
                <h3 className="modal-subtitle">📋 Daftar Generus</h3>
                <div className="generus-list modal-list">
                  {kelompokStats[selectedKelompok].generusList.map((item) => (
                    <div key={item.id} className="generus-card modal-card" onClick={() => goToDetail(item.id)}>
                      <div className="generus-header">
                        <h3 className="generus-name">{item.nama_lengkap || 'Nama belum diisi'}</h3>
                        <span className={`gender-badge ${item.jenis_kelamin === 'Perempuan' ? 'female' : ''}`}>
                          {item.jenis_kelamin === 'Laki-laki' ? '👦' : '👧'} {item.jenis_kelamin || 'Belum diisi'}
                        </span>
                      </div>
                      
                      <div className="generus-details">
                        <div className="detail-item">
                          <span className="detail-icon">🎓</span>
                          <span>Pendidikan: {item.jenjang_pendidikan || 'Belum diisi'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📅</span>
                          <span>TTL: {item.tempat_lahir || 'Tempat lahir'}, {item.tanggal_lahir ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID') : 'Tanggal lahir'} {item.tanggal_lahir && `(${calculateAge(item.tanggal_lahir)} tahun)`}</span>
                        </div>
                      </div>
                      
                      <div className="detail-badges">
                        <span className="detail-badge">📚 {item.jenjang_pembinaan || 'Belum diisi'}</span>
                      </div>
                      
                      <button className="detail-button" onClick={() => goToDetail(item.id)}>
                        👀 Lihat Detail
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageHome;