import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import FormInputAlamatSambung from "./FormInputAlamatSambung";
import FormInputPembinaan from "./FormInputPembinaan";
import FormInputPendidikan from "./FormInputPendidikan";
import { useAuth } from "../context/AuthContext";
import "./FormTambahGenerus.css"; // ✅ Import CSS

function FormTambahGenerus() {
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [form, setForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) return;

    const isAdmin = auth.role?.includes("administrator");

    const defaultForm = {
      nama_lengkap: "",
      nama_panggilan: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      golongan_darah: "",
      jumlah_saudara: "",
      anak_ke_berapa: "",
      riwayat_penyakit: "",
      orangtua: {
        nama_ayah: "",
        nama_ibu: "",
        pekerjaan_ayah: "",
        pendidikan_terakhir_ayah: "",
        pekerjaan_ibu: "",
        pendidikan_terakhir_ibu: "",
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
        kelompok: isAdmin ? "" : auth.kelompok || "",
        desa: isAdmin ? "" : auth.desa || "",
      },
      no_hp: [""],
      hobi: [""],
      minat: [""],
      cita_cita: [""],
      prestasi: [""],
      kejuaraan: [""],
      jenjang_pendidikan: "",
      nama_sekolah: "",
      jenjang_pembinaan: "",
    };

    setForm(defaultForm);
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const fetchGenerus = async (data) => {
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/db/generus/tambah?_=${new Date().getTime()}`;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification("✅ Data generus berhasil ditambahkan!");
      navigate("/");
    } catch (error) {
      showNotification("❌ Gagal menambahkan data generus.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetchGenerus(form);
    setIsSubmitting(false);
  };

  if (!form) {
    return (
      <div className="loading-form">
        <div className="loading-spinner"></div>
        <p>Mempersiapkan form...</p>
      </div>
    );
  }

  const formatLabel = (text) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="form-tambah-generus">
      <div className="form-header">
        <h1 className="form-title">➕ Tambah Generus Baru</h1>
        <p className="form-subtitle">Isi data lengkap generus dengan benar</p>
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
              />
            </div>
            <div className="form-group">
              <label htmlFor="riwayat_penyakit" className="form-label">
                Riwayat penyakit
              </label>
              <input
                type="text"
                id="riwayat_penyakit"
                name="riwayat_penyakit"
                className="form-input"
                placeholder="Riwayat penyakit"
                onChange={handleChange}
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
                  onChange={(e) => handleNestedChange(e, "alamat")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alamat Sambung & No HP */}
        <div className="form-section">
          <h2 className="section-title">📍 Alamat Sambung & Kontak</h2>
          <FormInputAlamatSambung form={form} setForm={setForm} />
          
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
                  value={form.orangtua[field]}
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
            <FormInputPendidikan form={form} setForm={setForm} />
            <div className="form-group">
              <label htmlFor="nama_sekolah" className="form-label">
                Nama Sekolah
              </label>
              <input
                type="text"
                id="nama_sekolah"
                name="nama_sekolah"
                className="form-input"
                placeholder="Nama Sekolah"
                onChange={handleChange}
              />
            </div>
            <FormInputPembinaan form={form} setForm={setForm} />
          </div>
        </div>

        {/* Data Array (Hobi, Cita-cita, dll) */}
        <div className="form-section">
          <h2 className="section-title">⭐ Data Tambahan</h2>
          <div className="form-grid">
            {["hobi", "minat", "cita_cita", "prestasi", "kejuaraan"].map((key) => (
              <div key={key} className="form-group">
                <label className="form-label">
                  {formatLabel(key)}
                </label>
                {form[key].map((item, idx) => (
                  <div key={idx} className="array-item">
                    <input
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
                Menyimpan...
              </>
            ) : (
              "💾 Simpan Data Generus"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormTambahGenerus;