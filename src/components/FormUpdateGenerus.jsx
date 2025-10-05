import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import FormInputAlamatSambung from "./FormInputAlamatSambung";
import FormInputPembinaan from "./FormInputPembinaan";
import axios from "axios";
import FormInputPendidikan from "./FormInputPendidikan";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

function FormUpdateGenerus() {
  const { id } = useParams();
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth?.role?.includes("administrator");

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
      showNotification("Data generus berhasil diupdate!");
      navigate(`/generus/${id}`);
    } catch (error) {
      showNotification("Data generus gagal diupdate!");
    } finally {
      console.log("finally");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    kirimTambahGenerus(form, id);
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
          jenjang_pendidikan: response.data.data.jenjang_pendidikan || [],
          jenjang_pembinaan: response.data.data.jenjang_pembinaan || [],
        });
      } catch (error) {
        console.log("error = ", error);
      } finally {
        console.log("finally");
      }
    };

    fetchGenerus();
  }, []);

  return (
    <div>
      <h1>Update Generus</h1>
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
                  value={form.nama_lengkap}
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
                  value={form.nama_panggilan}
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
                    value={form.tempat_lahir}
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
                    value={form.tanggal_lahir}
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
                    value={form.jenis_kelamin} // ini penting!
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
                    value={form.jumlah_saudara}
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
                    value={form.anak_ke_berapa}
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
                    placeholder={field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={form.alamat[field] || ""}
                    onChange={(e) => handleNestedChange(e, "alamat")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div>
            <p>Isi Data Alamat Sambung</p>
            {/* <div>
              
              {Object.keys(form.alamat_sambung).map((field) => (
                <div key={field}>
                  <label htmlFor={field}>
                    {field.toUpperCase()} :
                  </label>
                  <input
                    id={field}
                    name={field}
                    placeholder={field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={form.alamat_sambung[field] || ""}
                    onChange={(e) => handleNestedChange(e, "alamat_sambung")}
                  />
                </div>
              ))}
            </div> */}

            <div>
              {Object.keys(form.alamat_sambung).map((field) => (
                <div key={field}>
                  <label htmlFor={field}>
                    {field.toUpperCase()} :
                  </label>
                  <input
                    id={field}
                    name={field}
                    placeholder={field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={form.alamat_sambung[field] || ""}
                    onChange={(e) => handleNestedChange(e, "alamat_sambung")}
                    readOnly={!isAdmin} // ✅ Ini dia: hanya admin yang bisa edit
                    style={{ backgroundColor: !isAdmin ? "#f5f5f5" : "white" }} // optional: beda warna
                  />
                </div>
              ))}
            </div>

          </div>
          <div>
            <p>Isi Data Nomor HP</p>
            <label htmlFor="no_hp">
              Nomor HP :
            </label>
            {form.no_hp.map((item, idx) => (
              <div key={idx}>
                <input
                  type="tel"
                  name="no_hp"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={item}
                  placeholder="No HP"
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, ""); // hapus semua non-digit
                    handleArrayChange(idx, "no_hp", numericValue);
                  }}
                />
              </div>
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
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      value={form.orangtua[field] || ""}
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
            <div>
              <label htmlFor="jenjang_pendidikan">
                Jenjang pendidikan :
              </label>
              <input
                type="text"
                id="jenjang_pendidikan"
                name="jenjang_pendidikan"
                placeholder="Jenjang pendidikan"
                onChange={handleChange}
                value={form.jenjang_pendidikan}
              />
            </div>
            <div>
              <label htmlFor="jenjang_pembinaan">
                Jenjang pembinaan :
              </label>
              <input
                type="text"
                id="jenjang_pembinaan"
                name="jenjang_pembinaan"
                placeholder="Jenjang pembinaan"
                onChange={handleChange}
                value={form.jenjang_pembinaan}
              />
            </div>
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
                    type="text"
                    value={item}
                    placeholder={key.replace("_", " ")}
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
                Tambah {key.replace("_", " ")}
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
        >
          <p>Edit Data Generus</p>
        </button>
      </form>
    </div>
  );
}

export default FormUpdateGenerus;
