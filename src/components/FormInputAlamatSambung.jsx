import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const FormInputAlamatSambung = ({ form, setForm }) => {
  const { auth } = useAuth();
  const isAdmin = auth?.role?.includes("administrator");

  const kelompokByDesa = {
    Timur: [
      "Jabal Nur",
      "Arrosyidin",
      "Almukmin",
      "Kampung 6 Atas",
      "Kampung 6 Bawah",
      "Kampung 1",
      "Markoni",
      "Amal",
      "Bunyu",
    ],
    Barat: [
      "Simpang 3",
      "Sebengkok",
      "Gunung Lingkas",
      "Mulawarman",
      "Karang Rejo",
      "Perikanan 1",
      "Perikanan 2",
      "Nur Iman",
      "Pantai Indah",
      "Pantura",
      "KTT",
      "Malinau",
    ],
  };

  const desaList = Object.keys(kelompokByDesa);
  const selectedDesa = form.alamat_sambung?.desa || "";
  const kelompokList = selectedDesa ? kelompokByDesa[selectedDesa] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Jika desa berubah, kosongkan kelompok juga
    if (name === "desa") {
      setForm((prev) => ({
        ...prev,
        alamat_sambung: {
          ...prev.alamat_sambung,
          desa: value,
          kelompok: "", // Reset kelompok
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        alamat_sambung: {
          ...prev.alamat_sambung,
          [name]: value,
        },
      }));
    }
  };

  return (
    <div>
      <p>Isi Data Alamat Sambung</p>
      <div>
        {/* Select Desa */}
        <div>
          <label htmlFor="desa">Desa :</label>
          <select
            id="desa"
            name="desa"
            value={form.alamat_sambung.desa || ""}
            onChange={handleChange}
            disabled={!isAdmin} // 🔒 Non-admin tidak bisa pilih
          >
            <option value="">Pilih Desa</option>
            {desaList.map((desa) => (
              <option key={desa} value={desa}>
                {desa}
              </option>
            ))}
          </select>
        </div>

        {/* Select Kelompok */}
        <div>
          <label htmlFor="kelompok">Kelompok :</label>
          <select
            id="kelompok"
            name="kelompok"
            value={form.alamat_sambung.kelompok || ""}
            onChange={handleChange}
            disabled={!isAdmin || !selectedDesa} // 🔒 Non-admin dan yang belum pilih desa tidak bisa pilih kelompok
          >
            <option value="">Pilih Kelompok</option>
            {kelompokList.map((kelompok) => (
              <option key={kelompok} value={kelompok}>
                {kelompok}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};

export default FormInputAlamatSambung;
