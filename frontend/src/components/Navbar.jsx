import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-red-100">
      <Link to="/" className="select-none">
        <div className="text-3xl font-extrabold text-red-600">
          Lapor<span className="text-neutral-800">Pak</span>
        </div>
      </Link>

      <div className="flex gap-6 items-center text-base font-medium">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-800 hover:text-red-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-3 py-1 rounded transition duration-200 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-800 hover:text-red-600 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
