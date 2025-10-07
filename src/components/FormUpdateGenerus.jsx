import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import FormInputAlamatSambung from "./FormInputAlamatSambung";
import FormInputPembinaan from "./FormInputPembinaan";
import axios from "axios";
import FormInputPendidikan from "./FormInputPendidikan";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import "./FormUpdateGenerus.css"; // ✅ Import CSS

function FormUpdateGenerus() {
  const { id } = useParams();
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth?.role?.includes("administrator");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const [form, setForm] = useState({
    nama_lengkap: "",
    nama_panggilan: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    golongan_darah: "",
    jumlah_saudara: "",
    anak_ke_berapa: "",
    orangtua: {
      nama_ayah: "",
      nama_ibu: "",
      pekerjaan_ayah: "",
      pekerjaan_ibu: "",
      keahlian: "",
      no_hp: "",
    },
    alamat: {
      jalan: "",
      rt: "",
      rw: "",
      kelurahan: "",
      kecamatan: "",
    },
    alamat_sambung: {
      kelompok: "",
      desa: "",
    },
    no_hp: [""],
    hobi: [""],
    cita_cita: [""],
    prestasi: [""],
    kejuaraan: [""],
    jenjang_pendidikan: "",
    jenjang_pembinaan: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (index, name, value) => {
    setForm((prev) => {
      const updated = [...prev[name]];
      updated[index] = value;
      return { ...prev, [name]: updated };
    });
  };

  const addField = (name) => {
    setForm((prev) => ({ ...prev, [name]: [...prev[name], ""] }));
  };

  const removeField = (name, index) => {
    setForm((prev) => {
      const updated = [...prev[name]];
      updated.splice(index, 1);
      return { ...prev, [name]: updated };
    });
  };

  const kirimTambahGenerus = async (data, id) => {
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/db/generus/update/${id}?_=${new Date().getTime()}`;

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification("✅ Data generus berhasil diupdate!");
      navigate(`/generus/${id}`);
    } catch (error) {
      showNotification("❌ Data generus gagal diupdate!");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await kirimTambahGenerus(form, id);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/db/generus/detail/${id}?_=${new Date().getTime()}`;

    const fetchGenerus = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm({
          nama_lengkap: response.data.data.nama_lengkap || "",
          nama_panggilan: response.data.data.nama_panggilan || "",
          tempat_lahir: response.data.data.tempat_lahir || "",
          tanggal_lahir: response.data.data.tanggal_lahir || "",
          jenis_kelamin: response.data.data.jenis_kelamin || "",
          golongan_darah: response.data.data.golongan_darah || "",
          jumlah_saudara: response.data.data.jumlah_saudara || "",
          anak_ke_berapa: response.data.data.anak_ke_berapa || "",
          alamat: {
            jalan: response.data.data?.jalan || "",
            rt: response.data.data?.rt || "",
            rw: response.data.data?.rw || "",
            kelurahan: response.data.data?.kelurahan || "",
            kecamatan: response.data.data?.kecamatan || "",
          },
          alamat_sambung: {
            kelompok: response.data.data?.kelompok || "",
            desa: response.data.data?.desa || "",
          },
          orangtua: {
            nama_ayah: response.data.data?.nama_ayah || "",
            nama_ibu: response.data.data?.nama_ibu || "",
            pekerjaan_ayah: response.data.data?.pekerjaan_ayah || "",
            pekerjaan_ibu: response.data.data?.pekerjaan_ibu || "",
            keahlian: response.data.data?.keahlian || "",
            no_hp: response.data.data?.no_hp || "",
          },
          no_hp: response.data.data.no_hp || [""],
          hobi: response.data.data.hobi || [""],
          cita_cita: response.data.data.cita_cita || [""],
          prestasi: response.data.data.prestasi || [""],
          kejuaraan: response.data.data.kejuaraan || [""],
          jenjang_pendidikan: response.data.data.jenjang_pendidikan || "",
          jenjang_pembinaan: response.data.data.jenjang_pembinaan || "",
        });
      } catch (error) {
        console.log("error = ", error);
        showNotification("❌ Gagal memuat data generus");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenerus();
  }, [id]);

  const formatLabel = (text) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="loading-form">
        <div className="loading-spinner"></div>
        <p>Memuat data generus...</p>
      </div>
    );
  }

  return (
    <div className="form-update-generus">
      <div className="form-header">
        <h1 className="form-title">✏️ Update Data Generus</h1>
        <p className="form-subtitle">Perbarui data generus dengan informasi terbaru</p>
        {isAdmin && (
          <div className="admin-badge">
            👨‍💼 Mode Administrator
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        {/* Data Diri */}
        <div className="form-section">
          <h2 className="section-title">👤 Data Diri</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nama_lengkap" className="form-label required">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama_lengkap"
                name="nama_lengkap"
                className="form-input"
                placeholder="Masukkan nama lengkap"
                onChange={handleChange}
                value={form.nama_lengkap}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nama_panggilan" className="form-label">
                Nama Panggilan
              </label>
              <input
                type="text"
                id="nama_panggilan"
                name="nama_panggilan"
                className="form-input"
                placeholder="Masukkan nama panggilan"
                onChange={handleChange}
                value={form.nama_panggilan}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tempat_lahir" className="form-label required">
                Tempat Lahir
              </label>
              <input
                type="text"
                id="tempat_lahir"
                name="tempat_lahir"
                className="form-input"
                placeholder="Masukkan tempat lahir"
                onChange={handleChange}
                value={form.tempat_lahir}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tanggal_lahir" className="form-label required">
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="tanggal_lahir"
                name="tanggal_lahir"
                className="form-input"
                onChange={handleChange}
                value={form.tanggal_lahir}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="jenis_kelamin" className="form-label required">
                Jenis Kelamin
              </label>
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                className="form-select"
                value={form.jenis_kelamin}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="golongan_darah" className="form-label">
                Golongan Darah
              </label>
              <select
                id="golongan_darah"
                name="golongan_darah"
                className="form-select"
                value={form.golongan_darah || ""}
                onChange={handleChange}
              >
                <option value="">Pilih Golongan Darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="jumlah_saudara" className="form-label">
                Jumlah Saudara
              </label>
              <input
                type="number"
                id="jumlah_saudara"
                name="jumlah_saudara"
                className="form-input"
                min={0}
                placeholder="0"
                onChange={handleChange}
                value={form.jumlah_saudara}
              />
            </div>

            <div className="form-group">
              <label htmlFor="anak_ke_berapa" className="form-label">
                Anak Ke-berapa
              </label>
              <input
                type="number"
                id="anak_ke_berapa"
                name="anak_ke_berapa"
                className="form-input"
                min={0}
                placeholder="0"
                onChange={handleChange}
                value={form.anak_ke_berapa}
              />
            </div>
          </div>
        </div>

        {/* Data Alamat */}
        <div className="form-section">
          <h2 className="section-title">🏠 Data Alamat</h2>
          <div className="nested-grid">
            {Object.keys(form.alamat).map((field) => (
              <div key={field} className="form-group">
                <label htmlFor={field} className="form-label">
                  {formatLabel(field)}
                </label>
                <input
                  id={field}
                  name={field}
                  className="form-input"
                  placeholder={`Masukkan ${formatLabel(field).toLowerCase()}`}
                  value={form.alamat[field] || ""}
                  onChange={(e) => handleNestedChange(e, "alamat")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alamat Sambung & No HP */}
        <div className="form-section">
          <h2 className="section-title">📍 Alamat Sambung & Kontak</h2>
          
          {!isAdmin && (
            <div className="read-only-info">
              ℹ️ Hanya administrator yang dapat mengubah data alamat sambung
            </div>
          )}
          
          <div className="form-grid">
            {Object.keys(form.alamat_sambung).map((field) => (
              <div key={field} className="form-group">
                <label htmlFor={field} className="form-label">
                  {formatLabel(field)}
                  {!isAdmin && " 🔒"}
                </label>
                <input
                  id={field}
                  name={field}
                  className="form-input"
                  placeholder={`Masukkan ${formatLabel(field).toLowerCase()}`}
                  value={form.alamat_sambung[field] || ""}
                  onChange={(e) => handleNestedChange(e, "alamat_sambung")}
                  readOnly={!isAdmin}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">📱 Nomor HP</label>
            {form.no_hp.map((item, idx) => (
              <div key={idx} className="array-item">
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={item}
                  className="form-input array-input"
                  placeholder="Contoh: 081234567890"
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleArrayChange(idx, "no_hp", numericValue);
                  }}
                />
                {form.no_hp.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => removeField("no_hp", idx)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-field-btn"
              onClick={() => addField("no_hp")}
            >
              ➕ Tambah No HP
            </button>
          </div>
        </div>

        {/* Data Orang Tua */}
        <div className="form-section">
          <h2 className="section-title">👨‍👩‍👧‍👦 Data Orang Tua</h2>
          <div className="form-grid">
            {form.orangtua && Object.keys(form.orangtua).map((field) => (
              <div key={field} className="form-group">
                <label htmlFor={field} className="form-label">
                  {formatLabel(field)}
                </label>
                <input
                  id={field}
                  name={field}
                  className="form-input"
                  placeholder={`Masukkan ${formatLabel(field).toLowerCase()}`}
                  value={form.orangtua[field] || ""}
                  onChange={(e) => handleNestedChange(e, "orangtua")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pendidikan & Pembinaan */}
        <div className="form-section">
          <h2 className="section-title">🎓 Pendidikan & Pembinaan</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="jenjang_pendidikan" className="form-label">
                Jenjang Pendidikan
              </label>
              <input
                type="text"
                id="jenjang_pendidikan"
                name="jenjang_pendidikan"
                className="form-input"
                placeholder="Jenjang pendidikan"
                onChange={handleChange}
                value={form.jenjang_pendidikan}
              />
            </div>
            <div className="form-group">
              <label htmlFor="jenjang_pembinaan" className="form-label">
                Jenjang Pembinaan
              </label>
              <input
                type="text"
                id="jenjang_pembinaan"
                name="jenjang_pembinaan"
                className="form-input"
                placeholder="Jenjang pembinaan"
                onChange={handleChange}
                value={form.jenjang_pembinaan}
              />
            </div>
          </div>
        </div>

        {/* Data Array (Hobi, Cita-cita, dll) */}
        <div className="form-section">
          <h2 className="section-title">⭐ Data Tambahan</h2>
          <div className="form-grid">
            {["hobi", "cita_cita", "prestasi", "kejuaraan"].map((key) => (
              <div key={key} className="form-group">
                <label className="form-label">
                  {formatLabel(key)}
                </label>
                {form[key].map((item, idx) => (
                  <div key={idx} className="array-item">
                    <input
                      type="text"
                      value={item}
                      className="form-input array-input"
                      placeholder={`Masukkan ${formatLabel(key).toLowerCase()}`}
                      onChange={(e) =>
                        handleArrayChange(idx, key, e.target.value)
                      }
                    />
                    {form[key].length > 1 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => removeField(key, idx)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-field-btn"
                  onClick={() => addField(key)}
                >
                  ➕ Tambah {formatLabel(key)}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner" style={{width: '20px', height: '20px', display: 'inline-block', marginRight: '10px'}}></div>
                Memperbarui...
              </>
            ) : (
              "💾 Update Data Generus"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormUpdateGenerus;