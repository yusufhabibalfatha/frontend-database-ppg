import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import FormInputAlamatSambung from "./FormInputAlamatSambung";
import FormInputPembinaan from "./FormInputPembinaan";
import FormInputPendidikan from "./FormInputPendidikan";
import { useAuth } from "../context/AuthContext";

function FormTambahGenerus() {
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [form, setForm] = useState(null); // mulai dari null

  // const [form, setForm] = useState({
  //   nama_lengkap: "",
  //   nama_panggilan: "",
  //   tempat_lahir: "",
  //   tanggal_lahir: "",
  //   jenis_kelamin: "",
  //   golongan_darah: "",
  //   jumlah_saudara: "",
  //   anak_ke_berapa: "",
  //   orangtua: {
  //     nama_ayah: "",
  //     nama_ibu: "",
  //     pekerjaan_ayah: "",
  //     pekerjaan_ibu: "",
  //     keahlian: "",
  //     no_hp: "",
  //   },
  //   alamat: {
  //     jalan: "",
  //     rt: "",
  //     rw: "",
  //     kelurahan: "",
  //     kecamatan: "",
  //   },
  //   alamat_sambung: {
  //     kelompok: "",
  //     desa: "",
  //   },
  //   no_hp: [""],
  //   hobi: [""],
  //   cita_cita: [""],
  //   prestasi: [""],
  //   kejuaraan: [""],
  //   jenjang_pendidikan: "",
  //   jenjang_pembinaan: "",
  // });

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
        kelompok: isAdmin ? "" : auth.kelompok || "",
        desa: isAdmin ? "" : auth.desa || "", // sesuaikan field ini jika ada
      },
      no_hp: [""],
      hobi: [""],
      cita_cita: [""],
      prestasi: [""],
      kejuaraan: [""],
      jenjang_pendidikan: "",
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
      showNotification("Data generus berhasil ditambahkan!");
      navigate("/");
    } catch (error) {
      showNotification("Gagal menambahkan data generus.");
    } finally {
      console.log("finally");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchGenerus(form);
  };

  if (!form) return <p>Loading form...</p>;
  
  return (
    <div>
      <h1>Tambah Generus</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <p>Isi Data Diri</p>
            <div>
              <div>
                <label htmlFor="nama_lengkap">
                  Nama lengkap :
                </label>
                <input
                  type="text"
                  id="nama_lengkap"
                  name="nama_lengkap"
                  placeholder="Nama Lengkap"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="nama_panggilan">
                  Nama panggilan :
                </label>
                <input
                  type="text"
                  id="nama_panggilan"
                  name="nama_panggilan"
                  placeholder="Nama Panggilan"
                  onChange={handleChange}
                />
              </div>
              <div>
                <div>
                  <label htmlFor="tempat_lahir">
                    Tempat lahir :
                  </label>
                  <input
                    type="text"
                    id="tempat_lahir"
                    name="tempat_lahir"
                    placeholder="Tempat Lahir"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="tanggal_lahir">
                    Tanggal lahir :
                  </label>
                  <input
                    type="date"
                    id="tanggal_lahir"
                    name="tanggal_lahir"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div>
                  <label htmlFor="jenis_kelamin">
                    Jenis kelamin :
                  </label>
                  <select
                    id="jenis_kelamin"
                    name="jenis_kelamin"
                    onChange={handleChange}
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="golongan_darah">
                    Golongan darah :
                  </label>
                  <select
                    id="golongan_darah"
                    name="golongan_darah"
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
              </div>

              <div>
                <div>
                  <label htmlFor="jumlah_saudara">
                    Jumlah saudara :
                  </label>
                  <input
                    type="number"
                    id="jumlah_saudara"
                    name="jumlah_saudara"
                    min={0}
                    placeholder="Jumlah Saudara"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="anak_ke_berapa">
                    Anak ke berapa :
                  </label>
                  <input
                    type="number"
                    id="anak_ke_berapa"
                    name="anak_ke_berapa"
                    min={0}
                    placeholder="Anak ke-berapa"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p>Isi Data Alamat</p>
            <div>
              {Object.keys(form.alamat).map((field, index, array) => (
                <div
                  key={field}
                >
                  <label htmlFor={field}>
                    {field.toUpperCase()} :
                  </label>
                  <input
                    id={field}
                    name={field}
                    placeholder={field}
                    onChange={(e) => handleNestedChange(e, "alamat")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <FormInputAlamatSambung form={form} setForm={setForm} />
          <div>
            <p>Isi Data Nomor HP</p>
            <label>Nomor HP :</label>
            {form.no_hp.map((item, idx) => (
              <input
                key={idx}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={item}
                placeholder="No HP"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // hapus semua non-digit
                  handleArrayChange(idx, "no_hp", numericValue);
                }}
              />
            ))}
            <button
              type="button"
              onClick={() => addField("no_hp")}
            >
              Tambah No HP
            </button>
          </div>
        </div>
        <div>
          <p>Isi Data Orang Tua</p>
          {form.orangtua && Object.keys(form.orangtua).length > 0 && (
            <div>
              {Object.keys(form.orangtua).map((field, index, array) => {
                const isLastTwo = index >= array.length - 2; // untuk 2 input terakhir
                return (
                  <div
                    key={field}
                  >
                    <label htmlFor={field}>
                      {field.toUpperCase()} :
                    </label>
                    <input
                      id={field}
                      name={field}
                      placeholder={field
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())} // Biar placeholder-nya rapi
                      value={form.orangtua[field]}
                      onChange={(e) => handleNestedChange(e, "orangtua")}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <p>Isi Data Pendidikan & Pembinaan</p>
          <div>
            <FormInputPendidikan form={form} setForm={setForm} />
            <FormInputPembinaan form={form} setForm={setForm} />
          </div>
        </div>

        <div>
          {["hobi", "cita_cita", "prestasi", "kejuaraan"].map((key) => (
            <div key={key}>
              <p>
                Isi Data {key.replace("_", " ")}
              </p>
              <label>
                {key.replace("_", " ")} :
              </label>
              {form[key].map((item, idx) => (
                <div key={idx}>
                  <input
                    value={item}
                    placeholder={key}
                    onChange={(e) =>
                      handleArrayChange(idx, key, e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(key)}
              >
                Tambah {key}
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
        >
          <p>Simpan Data Generus</p>
        </button>
      </form>
    </div>
  );
}

export default FormTambahGenerus;
