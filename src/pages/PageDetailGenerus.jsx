import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationContext } from "../context/NotificationContext";
import "./PageDetailGenerus.css";

function PageDetailGenerus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [generus, setGenerus] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const apiUrl = `${
      import.meta.env.VITE_API_URL || "http://ppg-generus.local/wp-json"
    }/db/generus/detail/${id}?_=${new Date().getTime()}`;

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGenerus(response.data.data);
      } catch (error) {
        console.error(error);
        showNotification("Gagal mengambil detail generus.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    const deleteUrl = `${
      import.meta.env.VITE_API_URL || "http://ppg-generus.local/wp-json"
    }/db/generus/delete/${id}`;

    try {
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification("Data berhasil dihapus.");
      navigate("/");
    } catch (error) {
      console.error(error);
      showNotification("Gagal menghapus data.");
    }
  };

  const renderArrayField = (arrayData) => {
    if (!arrayData || !Array.isArray(arrayData) || arrayData.length === 0) {
      return <span className="empty-value">-</span>;
    }
    return (
      <div className="array-container">
        {arrayData.map((item, index) => (
          <span key={index} className="array-item">
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderField = (value) => {
    if (!value || value === "") {
      return <span className="empty-value">-</span>;
    }
    return value;
  };

  if (loading) return <p className="loading-text">Memuat data...</p>;
  if (!generus) return <p className="error-text">Data tidak ditemukan.</p>;

  return (
    <div className="detail-generus-container">
      <h1 className="detail-generus-header">Detail Generus</h1>
      
      <div className="detail-generus-content">
        {/* Section Data Pribadi */}
        <div className="detail-section">
          <h3>Data Pribadi</h3>
          <div className="detail-item">
            <span className="detail-label">Nama Lengkap</span>
            <span className="detail-value">{generus.nama_lengkap}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Nama Panggilan</span>
            <span className="detail-value">{renderField(generus.nama_panggilan)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Jenis Kelamin</span>
            <span className="detail-value">{generus.jenis_kelamin}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tempat Lahir</span>
            <span className="detail-value">{generus.tempat_lahir}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tanggal Lahir</span>
            <span className="detail-value">
              {new Date(generus.tanggal_lahir).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Golongan Darah</span>
            <span className="detail-value">{renderField(generus.golongan_darah)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Riwayat Penyakit</span>
            <span className="detail-value">{renderField(generus.riwayat_penyakit)}</span>
          </div>
        </div>

        {/* Section Data Keluarga */}
        <div className="detail-section">
          <h3>Data Keluarga</h3>
          <div className="detail-item">
            <span className="detail-label">Nama Ayah</span>
            <span className="detail-value">{renderField(generus.nama_ayah)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pekerjaan Ayah</span>
            <span className="detail-value">{renderField(generus.pekerjaan_ayah)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pendidikan Ayah</span>
            <span className="detail-value">{renderField(generus.pendidikan_terakhir_ayah)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Nama Ibu</span>
            <span className="detail-value">{renderField(generus.nama_ibu)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pekerjaan Ibu</span>
            <span className="detail-value">{renderField(generus.pekerjaan_ibu)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pendidikan Ibu</span>
            <span className="detail-value">{renderField(generus.pendidikan_terakhir_ibu)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Anak Ke</span>
            <span className="detail-value">{generus.anak_ke_berapa}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Jumlah Saudara</span>
            <span className="detail-value">{generus.jumlah_saudara}</span>
          </div>
        </div>

        {/* Section Alamat */}
        <div className="detail-section">
          <h3>Alamat</h3>
          <div className="detail-item">
            <span className="detail-label">Jalan</span>
            <span className="detail-value">{renderField(generus.jalan)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">RT/RW</span>
            <span className="detail-value">{generus.rt}/{generus.rw}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Kelurahan</span>
            <span className="detail-value">{renderField(generus.kelurahan)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Desa</span>
            <span className="detail-value">{generus.desa}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Kecamatan</span>
            <span className="detail-value">{renderField(generus.kecamatan)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Kelompok</span>
            <span className="detail-value">{generus.kelompok}</span>
          </div>
        </div>

        {/* Section Pendidikan & Minat */}
        <div className="detail-section">
          <h3>Pendidikan & Minat</h3>
          <div className="detail-item">
            <span className="detail-label">Jenjang Pendidikan</span>
            <span className="detail-value">{renderField(generus.jenjang_pendidikan)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Nama Sekolah</span>
            <span className="detail-value">{renderField(generus.nama_sekolah)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Jenjang Pembinaan</span>
            <span className="detail-value">{renderField(generus.jenjang_pembinaan)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Cita-cita</span>
            <div className="detail-value">
              {renderArrayField(generus.cita_cita)}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Hobi</span>
            <div className="detail-value">
              {renderArrayField(generus.hobi)}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Minat</span>
            <div className="detail-value">
              {renderArrayField(generus.minat)}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Keahlian</span>
            <span className="detail-value">{renderField(generus.keahlian)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Prestasi</span>
            <div className="detail-value">
              {renderArrayField(generus.prestasi)}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Kejuaraan</span>
            <div className="detail-value">
              {renderArrayField(generus.kejuaraan)}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">No. HP</span>
            <div className="detail-value">
              {renderArrayField(generus.no_hp)}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <button 
          className="action-button back-button" 
          onClick={() => navigate(-1)}
        >
          🔙 Kembali
        </button>
        <button 
          className="action-button edit-button" 
          onClick={() => navigate(`/update/${id}`)}
        >
          ✏️ Edit Data
        </button>
        <button 
          className="action-button delete-button" 
          onClick={handleDelete}
        >
          ❌ Hapus Data
        </button>
      </div>
    </div>
  );
}

export default PageDetailGenerus;