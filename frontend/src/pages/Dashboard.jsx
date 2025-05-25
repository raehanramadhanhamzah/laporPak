import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Laporan</h2>
          <p className="text-3xl font-bold text-red-500">123</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Laporan Hari Ini</h2>
          <p className="text-3xl font-bold text-blue-500">6</p>
        </div>

      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Statistik Laporan</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Grafik
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Peta Titik Kebakaran</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Peta
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
