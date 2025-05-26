import { Link } from "react-router-dom";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-red-600">
        Lapor<span className="text-black">Pak</span>
      </div>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/" className="text-gray-700 hover:text-red-600">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-red-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-red-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
