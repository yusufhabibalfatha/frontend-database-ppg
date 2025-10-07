import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationContext } from "../context/NotificationContext";

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
        console.log('data ', response.data.data)
        // showNotification("Berhasil mengambil detail generus.");
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

  if (loading) return <p>Memuat data...</p>;
  if (!generus) return <p>Data tidak ditemukan.</p>;

  return (
    <div>
      <h1>Detail Generus</h1>
      <p><strong>Nama:</strong> {generus.nama_lengkap}</p>
      <p><strong>Jenis Kelamin:</strong> {generus.jenis_kelamin}</p>
      <p><strong>Tempat Lahir:</strong> {generus.tempat_lahir}</p>
      <p><strong>Tanggal Lahir:</strong> {generus.tanggal_lahir}</p>
      <p><strong>Kelompok:</strong> {generus.kelompok}</p>
      <p><strong>Desa:</strong> {generus.desa}</p>
      <p><strong>Jenjang Pendidikan:</strong> {generus.jenjang_pendidikan || '-'}</p>
      <p><strong>Jenjang Pembinaan:</strong> {generus.jenjang_pembinaan || '-'}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate(-1)}>🔙 Kembali</button>{" "}
        <button onClick={() => navigate(`/update/${id}`)}>✏️ Edit</button>{" "}
        <button onClick={handleDelete}>❌ Hapus</button>
      </div>
    </div>
  );
}

export default PageDetailGenerus;
