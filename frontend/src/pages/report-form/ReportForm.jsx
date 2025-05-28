import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { createReport } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationPicker({ onChange }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function FormLaporan() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    image: null,
    latitude: "",
    longitude: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleMapClick = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-5xl border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600 col-span-2">
          Form Laporan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              name="title"
              type="text"
              placeholder="Judul Laporan"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <textarea
              name="description"
              placeholder="Deskripsi Laporan"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <input
              name="address"
              type="text"
              placeholder="Alamat Kejadian"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-3 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 rounded border border-gray-300"
                style={{ maxWidth: "200", height: "150px", objectFit: "cover" }}
              />
            )}
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-600">Lokasi kejadian / laporan:</p>
            <MapContainer
              center={
                form.latitude && form.longitude
                  ? [form.latitude, form.longitude]
                  : [-5.1477, 119.4327]
              }
              zoom={10}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <LocationPicker onChange={handleMapClick} />
            </MapContainer>

            <p className="text-sm text-gray-400 mt-2">
              Koordinat: {form.latitude}, {form.longitude}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
        >
          Kirim Laporan
        </button>
      </form>
    </div>
  );
}
