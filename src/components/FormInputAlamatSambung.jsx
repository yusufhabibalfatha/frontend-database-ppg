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
      "Amin Manshurin",
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

    if (name === "desa") {
      setForm((prev) => ({
        ...prev,
        alamat_sambung: {
          ...prev.alamat_sambung,
          desa: value,
          kelompok: "",
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
    <div className="alamat-sambung-group">
      <div className="form-grid">
        {/* Select Desa */}
        <div className="form-group">
          <label htmlFor="desa" className="form-label required">
            Desa {!isAdmin && "🔒"}
          </label>
          <select
            id="desa"
            name="desa"
            value={form.alamat_sambung.desa || ""}
            onChange={handleChange}
            disabled={!isAdmin}
            className="form-select"
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
        <div className="form-group">
          <label htmlFor="kelompok" className="form-label required">
            Kelompok {!isAdmin && "🔒"}
          </label>
          <select
            id="kelompok"
            name="kelompok"
            value={form.alamat_sambung.kelompok || ""}
            onChange={handleChange}
            disabled={!isAdmin || !selectedDesa}
            className="form-select"
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
