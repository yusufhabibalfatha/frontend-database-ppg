import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

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

        console.log('generus, ', response.data[0].kelompok)
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
    return <p>Memuat data...</p>;
  }

  return (
    <div>
      <h1>Daftar Generus</h1>
      {auth?.role?.includes("administrator") && (
        <p>Admin Panel</p>
      )}
      {auth?.role?.includes("subscriber") && (
        <p>Kelas Generus - {auth?.kelompok}</p>
      )}
      
      <ul>
        {generus.map((item) => (
          <li key={item.id}>
            {item.nama_lengkap} - {item.jenis_kelamin}{" "}
            <button onClick={() => goToDetail(item.id)}>Detail</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PageHome;
