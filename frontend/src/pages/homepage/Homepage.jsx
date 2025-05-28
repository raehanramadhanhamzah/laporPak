import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-full max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Selamat Datang di LaporPak</h1>
        <p className="text-gray-600 mb-6">
          Platform pelaporan publik yang mudah, cepat, dan aman. Laporkan kejadian di sekitar Anda dengan satu klik.
        </p>
      </div>
    </div>
  );
}

export default Homepage;
