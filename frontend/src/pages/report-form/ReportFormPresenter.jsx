import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/api";
import ReportForm from "./ReportForm";

export default function ReportFormPresenter() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    image: null,
    latitude: "",
    longitude: "",
  });

  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const onLocationChange = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append(
      "location",
      JSON.stringify({
        address: form.address,
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(form.longitude), parseFloat(form.latitude)],
        },
      })
    );
    formData.append("image", form.image);

    try {
      const res = await createReport(formData);
      alert(res.message || "Laporan berhasil dikirim!");
      navigate("/dashboard");
    } catch (err) {
      alert("Gagal membuat laporan: " + (err.message || "Terjadi kesalahan"));
    }
  };

  return (
    <ReportForm
      form={form}
      onInputChange={onInputChange}
      onLocationChange={onLocationChange}
      onSubmit={onSubmit}
    />
  );
}
