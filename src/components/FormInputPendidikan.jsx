import { useState, useEffect } from "react";

const FormInputPendidikan = ({ form, setForm }) => {
  const jenjangPendidikanList = [
    "PAUD",
    "TK",
    "SD 1",
    "SD 2",
    "SD 3",
    "SD 4",
    "SD 5",
    "SD 6",
    "SMP 1",
    "SMP 2",
    "SMP 3",
    "SMA / SMK",
    "KULIAH",
    "BEKERJA",
    "BELUM BEKERJA",
  ];

  const [jurusan, setJurusan] = useState("");

  const handlePendidikanChange = (e) => {
    const selected = e.target.value;
    setForm((prev) => ({
      ...prev,
      jenjang_pendidikan:
        selected === "KULIAH" ? `${selected} - ${jurusan}` : selected,
    }));

    if (selected !== "KULIAH") {
      setJurusan("");
    }
  };

  const handleJurusanChange = (e) => {
    const value = e.target.value;
    setJurusan(value);
    setForm((prev) => ({
      ...prev,
      jenjang_pendidikan: `KULIAH - ${value}`,
    }));
  };

  useEffect(() => {
    if (
      form.jenjang_pendidikan &&
      form.jenjang_pendidikan.startsWith("KULIAH - ")
    ) {
      setJurusan(form.jenjang_pendidikan.replace("KULIAH - ", ""));
    }
  }, []);

  return (
    <div>
      <label htmlFor="jenjang_pendidikan" className="text-xs required">
        Jenjang pendidikan :
      </label>
      <select
        id="jenjang_pendidikan"
        name="jenjang_pendidikan"
        value={
          form.jenjang_pendidikan?.startsWith("KULIAH")
            ? "KULIAH"
            : form.jenjang_pendidikan || ""
        }
        onChange={handlePendidikanChange}
        className="w-full border-black border-4 shadow-[4px_4px_0px_0px_#000000] bg-indigo-300 font-bold px-2 py-4"
        required
      >
        <option value="">Pilih Jenjang Pendidikan</option>
        {jenjangPendidikanList.map((jenjang) => (
          <option key={jenjang} value={jenjang}>
            {jenjang}
          </option>
        ))}
      </select>

      {form.jenjang_pendidikan?.startsWith("KULIAH") && (
        <input
          type="text"
          placeholder="Masukkan jurusan"
          value={jurusan}
          onChange={handleJurusanChange}
          className="w-full border-black border-4 shadow-[4px_4px_0px_0px_#000000] bg-indigo-300 font-bold px-2 py-4 mt-2"
          required
        />
      )}
    </div>
  );
};

export default FormInputPendidikan;