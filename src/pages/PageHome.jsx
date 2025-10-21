import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { exportToExcel, exportStatisticsToExcel, formatGenerusForExport } from "../utils/exportToExcel";
import "./PageHome.css";

function PageHome() {
  const { showNotification } = useContext(NotificationContext);
  const { auth } = useAuth();
  const [generus, setGenerus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
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

  // Kategori pendidikan yang digabung
  const pendidikanCategories = {
    'PAUD': ['PAUD'],
    'TK': ['TK', 'TK 1', 'TK 2', 'TK 3'],
    'SD': ['SD 1', 'SD 2', 'SD 3', 'SD 4', 'SD 5', 'SD 6'],
    'SMP': ['SMP 1', 'SMP 2', 'SMP 3'],
    'SMA/SMK': ['SMA 1', 'SMA 2', 'SMA 3', 'SMK 1', 'SMK 2', 'SMK 3', 'SMA / SMK'],
    'KULIAH': ['KULIAH'],
    'BEKERJA': ['BEKERJA'],
    'BELUM BEKERJA': ['BELUM BEKERJA', 'TIDAK SEKOLAH']
  };

  // Urutan jenjang pembinaan
  const pembinaanOrder = [
    "PAUD (TK)",
    "CABERAWIT (SD)", 
    "PRA REMAJA (SMP)",
    "REMAJA (SMA)",
    "PRA NIKAH (MANDIRI)"
  ];

  // Fungsi untuk membersihkan dan normalisasi data pendidikan
  const cleanPendidikanData = (pendidikan) => {
    if (!pendidikan) return 'BELUM DIISI';
    
    const cleaned = pendidikan.toString().toUpperCase().trim();
    
    if (cleaned === '' || cleaned === 'NULL' || cleaned === 'UNDEFINED') {
      return 'BELUM DIISI';
    }
    
    return cleaned;
  };

  // Fungsi untuk mengelompokkan data pendidikan
  const groupPendidikanData = (pendidikanData) => {
    const grouped = {};
    
    Object.keys(pendidikanCategories).forEach(category => {
      grouped[category] = 0;
    });
    grouped['BELUM DIISI'] = 0;
    
    Object.entries(pendidikanData).forEach(([key, value]) => {
      let found = false;
      Object.entries(pendidikanCategories).forEach(([category, items]) => {
        if (items.includes(key.toUpperCase())) {
          grouped[category] += value;
          found = true;
        }
      });
      if (!found && key !== 'BELUM DIISI') {
        grouped['BELUM DIISI'] += value;
      }
    });
    
    // Hapus kategori yang jumlahnya 0
    Object.keys(grouped).forEach(key => {
      if (grouped[key] === 0 && key !== 'BELUM DIISI') {
        delete grouped[key];
      }
    });
    
    return grouped;
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

    // Kelompokkan data pendidikan
    stats.pendidikan = groupPendidikanData(stats.pendidikan);

    // Urutkan pembinaan sesuai urutan yang ditentukan
    const sortedPembinaan = {};
    pembinaanOrder.forEach(key => {
      if (stats.pembinaan[key]) {
        sortedPembinaan[key] = stats.pembinaan[key];
      }
    });

    // Tambahkan pembinaan lain yang tidak ada di urutan
    Object.keys(stats.pembinaan).forEach(key => {
      if (!pembinaanOrder.includes(key)) {
        sortedPembinaan[key] = stats.pembinaan[key];
      }
    });

    stats.pembinaan = sortedPembinaan;

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
          pendidikan: {},
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
      
      // Handle pendidikan data
      const pendidikan = cleanPendidikanData(item.jenjang_pendidikan);
      kelompokStats[kelompok].pendidikan[pendidikan] = 
        (kelompokStats[kelompok].pendidikan[pendidikan] || 0) + 1;
      
      kelompokStats[kelompok].generusList.push(item);
    });

    // Kelompokkan data pendidikan untuk setiap kelompok
    Object.keys(kelompokStats).forEach(kelompok => {
      kelompokStats[kelompok].pendidikan = groupPendidikanData(kelompokStats[kelompok].pendidikan);
    });
    
    return kelompokStats;
  };

  // Fungsi untuk export data
  const handleExportData = (data, exportType, filterName = '') => {
    if (!data || data.length === 0) {
      showNotification("❌ Tidak ada data untuk diexport");
      return;
    }

    const formattedData = formatGenerusForExport(data);
    const filename = `generus-${exportType}${filterName ? '-' + filterName.replace(/\s+/g, '-') : ''}`;
    
    const success = exportToExcel(formattedData, filename);
    if (success) {
      showNotification(`✅ Data berhasil diexport ke Excel`);
    } else {
      showNotification(`❌ Gagal mengexport data`);
    }
  };

  const handleExportStatistics = (stats, kelompok = '') => {
    const filename = `statistik${kelompok ? '-' + kelompok.replace(/\s+/g, '-') : ''}`;
    
    const success = exportStatisticsToExcel(stats, filename);
    if (success) {
      showNotification(`✅ Statistik berhasil diexport ke Excel`);
    } else {
      showNotification(`❌ Gagal mengexport statistik`);
    }
  };

  const statistics = calculateStatistics();
  const kelompokStats = calculateKelompokStats();

  // Filter data untuk subscriber berdasarkan kelompok mereka
  const filteredGenerus = auth?.role?.includes("subscriber") 
    ? generus.filter(item => item.kelompok === auth?.kelompok)
    : generus;

  // Urutkan generus berdasarkan nama A-Z
  const sortedGenerus = [...filteredGenerus].sort((a, b) => 
    (a.nama_lengkap || '').localeCompare(b.nama_lengkap || '')
  );

  const openKelompokModal = (kelompok) => {
    setSelectedKelompok(kelompok);
    setShowModal(true);
  };

  const openFilterModal = (filter, type) => {
    setSelectedFilter(filter);
    setFilterType(type);
    
    let filtered = [];
    const dataSource = auth?.role?.includes("subscriber") ? filteredGenerus : generus;

    if (type === 'pendidikan') {
      const categories = pendidikanCategories[filter] || [filter];
      filtered = dataSource.filter(item => {
        const pendidikan = cleanPendidikanData(item.jenjang_pendidikan);
        return categories.includes(pendidikan);
      });
    } else if (type === 'pembinaan') {
      filtered = dataSource.filter(item => item.jenjang_pembinaan === filter);
    } else if (type === 'gender') {
      filtered = dataSource.filter(item => item.jenis_kelamin === filter);
    } else if (type === 'total') {
      filtered = dataSource;
    }
    
    setFilteredData(filtered);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedKelompok(null);
    setSelectedFilter(null);
    setFilterType(null);
    setFilteredData([]);
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
            <button 
              className="export-btn"
              onClick={() => handleExportData(filteredGenerus, 'kelompok', auth?.kelompok)}
              title="Export data ke Excel"
            >
              📊 Export Excel
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        {filteredGenerus.length > 0 && (
          <div className="statistics-section">
            <div className="statistics-header">
              <h2 className="statistics-title">📈 Statistik Generus - {auth?.kelompok}</h2>
              <button 
                className="export-btn small"
                onClick={() => handleExportStatistics(subscriberStats, auth?.kelompok)}
                title="Export statistik ke Excel"
              >
                📈 Export Statistik
              </button>
            </div>
            
            <div className="statistics-grid">
              {/* Total Generus */}
              <div 
                className="stat-card total clickable"
                onClick={() => openFilterModal('total', 'total')}
              >
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3 className="stat-value">{subscriberStats.total}</h3>
                  <p className="stat-label">Total Generus</p>
                  <button 
                    className="export-mini-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportData(filteredGenerus, 'total', auth?.kelompok);
                    }}
                    title="Export semua data"
                  >
                    📥
                  </button>
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
                      <div 
                        key={key} 
                        className="stat-detail-row clickable"
                        onClick={() => openFilterModal(key, 'pembinaan')}
                      >
                        <span className="stat-detail-label">{key}</span>
                        <span className="stat-detail-value">{value}</span>
                        <button 
                          className="export-mini-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const filtered = filteredGenerus.filter(item => item.jenjang_pembinaan === key);
                            handleExportData(filtered, 'pembinaan', key);
                          }}
                          title={`Export data ${key}`}
                        >
                          📥
                        </button>
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
                      <div 
                        key={key} 
                        className="stat-detail-row clickable"
                        onClick={() => openFilterModal(key, 'pendidikan')}
                      >
                        <span className="stat-detail-label">{key}</span>
                        <span className="stat-detail-value">{value}</span>
                        <button 
                          className="export-mini-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const categories = pendidikanCategories[key] || [key];
                            const filtered = filteredGenerus.filter(item => {
                              const pendidikan = cleanPendidikanData(item.jenjang_pendidikan);
                              return categories.includes(pendidikan);
                            });
                            handleExportData(filtered, 'pendidikan', key);
                          }}
                          title={`Export data ${key}`}
                        >
                          📥
                        </button>
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
                    <div 
                      className="stat-detail-row clickable"
                      onClick={() => openFilterModal('Laki-laki', 'gender')}
                    >
                      <span className="stat-detail-label">👦 Laki-laki</span>
                      <span className="stat-detail-value">{subscriberStats.gender['Laki-laki']}</span>
                      <button 
                        className="export-mini-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const filtered = filteredGenerus.filter(item => item.jenis_kelamin === 'Laki-laki');
                          handleExportData(filtered, 'gender', 'Laki-laki');
                        }}
                        title="Export data Laki-laki"
                      >
                        📥
                      </button>
                    </div>
                    <div 
                      className="stat-detail-row clickable"
                      onClick={() => openFilterModal('Perempuan', 'gender')}
                    >
                      <span className="stat-detail-label">👧 Perempuan</span>
                      <span className="stat-detail-value">{subscriberStats.gender['Perempuan']}</span>
                      <button 
                        className="export-mini-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const filtered = filteredGenerus.filter(item => item.jenis_kelamin === 'Perempuan');
                          handleExportData(filtered, 'gender', 'Perempuan');
                        }}
                        title="Export data Perempuan"
                      >
                        📥
                      </button>
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
        
        {sortedGenerus.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-text">Tidak ada data generus</p>
            <p className="empty-subtext">Data generus akan muncul di sini setelah ditambahkan</p>
          </div>
        ) : (
          <div className="generus-list">
            {sortedGenerus.map((item) => (
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

        {/* Modal untuk Filter Data */}
        {(selectedFilter && filterType) && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {filterType === 'pendidikan' && `🎓 ${selectedFilter}`}
                  {filterType === 'pembinaan' && `📚 ${selectedFilter}`}
                  {filterType === 'gender' && `${selectedFilter === 'Laki-laki' ? '👦' : '👧'} ${selectedFilter}`}
                  {filterType === 'total' && `👥 Semua Generus`}
                </h2>
                <div className="modal-actions">
                  <button 
                    className="export-btn small"
                    onClick={() => handleExportData(filteredData, filterType, selectedFilter)}
                  >
                    📊 Export Data
                  </button>
                  <button className="modal-close" onClick={closeModal}>✕</button>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="filter-summary">
                  <p className="filter-count">
                    📊 Total: <strong>{filteredData.length}</strong> generus
                  </p>
                </div>

                <div className="modal-generus-list">
                  <div className="generus-list modal-list">
                    {filteredData.map((item) => (
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

  // TAMPILAN UNTUK ADMIN
  return (
    <div className="page-home">
      <div className="page-header">
        <h1 className="page-title">🏢 Dashboard Admin</h1>
        
        <div className="user-info admin">
          <p>👨‍💼 Admin Panel - Overview Semua Kelompok</p>
          <button 
            className="export-btn"
            onClick={() => handleExportData(generus, 'semua-data')}
            title="Export semua data generus"
          >
            📊 Export Semua Data
          </button>
        </div>
      </div>

      {/* Total Overview */}
      <div className="admin-overview">
        <div 
          className="overview-card total clickable"
          onClick={() => openFilterModal('total', 'total')}
        >
          <div className="overview-icon">👥</div>
          <div className="overview-content">
            <h3 className="overview-value">{generus.length}</h3>
            <p className="overview-label">Total Semua Generus</p>
            <button 
              className="export-mini-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleExportData(generus, 'total');
              }}
              title="Export semua data"
            >
              📥
            </button>
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
              <div className="modal-actions">
                <button 
                  className="export-btn small"
                  onClick={() => handleExportData(
                    kelompokStats[selectedKelompok].generusList, 
                    'kelompok', 
                    selectedKelompok
                  )}
                >
                  📊 Export Data
                </button>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>
            </div>
            
            <div className="modal-body">
              {/* Statistik Kelompok dalam Modal */}
              <div className="modal-statistics">
                <h3 className="modal-subtitle">📈 Statistik Kelompok</h3>
                <div className="statistics-grid modal-grid">
                  <div 
                    className="stat-card total clickable"
                    onClick={() => openFilterModal('total', 'total')}
                  >
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{kelompokStats[selectedKelompok].total}</h3>
                      <p className="stat-label">Total Generus</p>
                      <button 
                        className="export-mini-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportData(kelompokStats[selectedKelompok].generusList, 'total', selectedKelompok);
                        }}
                        title="Export semua data kelompok"
                      >
                        📥
                      </button>
                    </div>
                  </div>

                  <div className="stat-card gender">
                    <div className="stat-icon">👦👧</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{(kelompokStats[selectedKelompok].gender['Laki-laki'] || 0) + (kelompokStats[selectedKelompok].gender['Perempuan'] || 0)}</h3>
                      <p className="stat-label">Jenis Kelamin</p>
                      <div className="stat-details">
                        <div 
                          className="stat-detail-row clickable"
                          onClick={() => openFilterModal('Laki-laki', 'gender')}
                        >
                          <span className="stat-detail-label">👦 Laki-laki</span>
                          <span className="stat-detail-value">{kelompokStats[selectedKelompok].gender['Laki-laki'] || 0}</span>
                          <button 
                            className="export-mini-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const filtered = kelompokStats[selectedKelompok].generusList.filter(item => item.jenis_kelamin === 'Laki-laki');
                              handleExportData(filtered, 'gender', `Laki-laki-${selectedKelompok}`);
                            }}
                            title="Export data Laki-laki"
                          >
                            📥
                          </button>
                        </div>
                        <div 
                          className="stat-detail-row clickable"
                          onClick={() => openFilterModal('Perempuan', 'gender')}
                        >
                          <span className="stat-detail-label">👧 Perempuan</span>
                          <span className="stat-detail-value">{kelompokStats[selectedKelompok].gender['Perempuan'] || 0}</span>
                          <button 
                            className="export-mini-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const filtered = kelompokStats[selectedKelompok].generusList.filter(item => item.jenis_kelamin === 'Perempuan');
                              handleExportData(filtered, 'gender', `Perempuan-${selectedKelompok}`);
                            }}
                            title="Export data Perempuan"
                          >
                            📥
                          </button>
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
                          <div 
                            key={key} 
                            className="stat-detail-row clickable"
                            onClick={() => openFilterModal(key, 'pembinaan')}
                          >
                            <span className="stat-detail-label">{key}</span>
                            <span className="stat-detail-value">{value}</span>
                            <button 
                              className="export-mini-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                const filtered = kelompokStats[selectedKelompok].generusList.filter(item => item.jenjang_pembinaan === key);
                                handleExportData(filtered, 'pembinaan', `${key}-${selectedKelompok}`);
                              }}
                              title={`Export data ${key}`}
                            >
                              📥
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="stat-card pendidikan">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-content">
                      <h3 className="stat-value">{Object.keys(kelompokStats[selectedKelompok].pendidikan).length}</h3>
                      <p className="stat-label">Jenjang Pendidikan</p>
                      <div className="stat-details">
                        {Object.entries(kelompokStats[selectedKelompok].pendidikan).map(([key, value]) => (
                          <div 
                            key={key} 
                            className="stat-detail-row clickable"
                            onClick={() => openFilterModal(key, 'pendidikan')}
                          >
                            <span className="stat-detail-label">{key}</span>
                            <span className="stat-detail-value">{value}</span>
                            <button 
                              className="export-mini-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                const categories = pendidikanCategories[key] || [key];
                                const filtered = kelompokStats[selectedKelompok].generusList.filter(item => {
                                  const pendidikan = cleanPendidikanData(item.jenjang_pendidikan);
                                  return categories.includes(pendidikan);
                                });
                                handleExportData(filtered, 'pendidikan', `${key}-${selectedKelompok}`);
                              }}
                              title={`Export data ${key}`}
                            >
                              📥
                            </button>
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
                  {kelompokStats[selectedKelompok].generusList
                    .sort((a, b) => (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''))
                    .map((item) => (
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

      {/* Modal untuk Filter Data (Admin) */}
      {(selectedFilter && filterType) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {filterType === 'pendidikan' && `🎓 ${selectedFilter}`}
                {filterType === 'pembinaan' && `📚 ${selectedFilter}`}
                {filterType === 'gender' && `${selectedFilter === 'Laki-laki' ? '👦' : '👧'} ${selectedFilter}`}
                {filterType === 'total' && `👥 Semua Generus`}
              </h2>
              <div className="modal-actions">
                <button 
                  className="export-btn small"
                  onClick={() => handleExportData(filteredData, filterType, selectedFilter)}
                >
                  📊 Export Data
                </button>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="filter-summary">
                <p className="filter-count">
                  📊 Total: <strong>{filteredData.length}</strong> generus
                </p>
              </div>

              <div className="modal-generus-list">
                <div className="generus-list modal-list">
                  {filteredData
                    .sort((a, b) => (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''))
                    .map((item) => (
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