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
    <div className="form-group">
      <label htmlFor="jenjang_pembinaan" className="form-label required">
        Jenjang Pembinaan
      </label>
      <select
        id="jenjang_pembinaan"
        name="jenjang_pembinaan"
        value={form.jenjang_pembinaan || ""}
        onChange={handleChange}
        className="form-select"
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