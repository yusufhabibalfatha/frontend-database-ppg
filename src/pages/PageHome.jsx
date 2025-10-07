import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import "./PageHome.css"; // ✅ Import CSS

function PageHome() {
  const { showNotification } = useContext(NotificationContext);
  const { auth } = useAuth();
  const [generus, setGenerus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/generus/${id}`);
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
        setGenerus(response.data);
        // showNotification("Berhasil mengambil data generus.");
      } catch (error) {
        // showNotification("Gagal mengambil data generus.");
        console.error(error);
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

  return (
    <div className="page-home">
      <div className="page-header">
        <h1 className="page-title">📊 Daftar Generus</h1>
        
        {auth?.role?.includes("administrator") && (
          <div className="user-info admin">
            <p>👨‍💼 Admin Panel - Akses Penuh</p>
          </div>
        )}
        
        {auth?.role?.includes("subscriber") && (
          <div className="user-info subscriber">
            <p>👥 Kelas Generus - {auth?.kelompok}</p>
          </div>
        )}
      </div>
      
      {generus.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p className="empty-text">Tidak ada data generus</p>
          <p className="empty-subtext">Data generus akan muncul di sini setelah ditambahkan</p>
        </div>
      ) : (
        <div className="generus-list">
          {generus.map((item) => (
            <div key={item.id} className="generus-card" onClick={() => goToDetail(item.id)}>
              <div className="generus-header">
                <h3 className="generus-name">{item.nama_lengkap}</h3>
                <span className={`gender-badge ${item.jenis_kelamin === 'Perempuan' ? 'female' : ''}`}>
                  {item.jenis_kelamin === 'Laki-laki' ? '👦' : '👧'} {item.jenis_kelamin}
                </span>
              </div>
              
              <div className="generus-details">
                <div className="detail-item">
                  <span className="detail-icon">🏠</span>
                  <span>Desa: {item.desa}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <span>Kelompok: {item.kelompok}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎓</span>
                  <span>Pendidikan: {item.jenjang_pendidikan}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>TTL: {item.tempat_lahir}, {new Date(item.tanggal_lahir).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <div className="detail-badges">
                <span className="detail-badge">📚 {item.jenjang_pembinaan}</span>
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

export default PageHome;