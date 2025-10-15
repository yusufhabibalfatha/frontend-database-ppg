const FormInputPembinaan = ({ form, setForm }) => {
  const jenjangPembinaanList = [
    "PAUD (TK)",
    "CABERAWIT (SD)",
    "PRA REMAJA (SMP)",
    "REMAJA (SMA)",
    "PRA NIKAH (MANDIRI)",
  ];

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      jenjang_pembinaan: e.target.value,
    }));
  };

  return (
    <div>
      <label htmlFor="jenjang_pembinaan" className="text-xs required">
        Jenjang pembinaan :
      </label>
      <select
        id="jenjang_pembinaan"
        name="jenjang_pembinaan"
        value={form.jenjang_pembinaan || ""}
        onChange={handleChange}
        className="w-full border-black border-4 shadow-[4px_4px_0px_0px_#000000] bg-indigo-300 font-bold px-2 py-4"
        required
      >
        <option value="">Pilih Jenjang Pembinaan</option>
        {jenjangPembinaanList.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormInputPembinaan;