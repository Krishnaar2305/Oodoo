import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">
        <Link to="/">SkillSwap</Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
        <Link to="/browse" className="hover:text-yellow-300">Browse</Link>
        <Link to="/requests" className="hover:text-yellow-300">Requests</Link>
        <Link to="/skills" className="hover:text-yellow-300">Skills</Link>
        <Link to="/signup" className="hover:text-yellow-300">Sign Up</Link>
        <Link to="/login" className="hover:text-yellow-300">Log In</Link>
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
