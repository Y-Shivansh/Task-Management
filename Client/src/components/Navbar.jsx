import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/landing");
  };

  return (
    <nav className=" bg-gray-800 text-white">
      <div className="max-w-8xl mx-auto px-2 sm:px-2 lg:px-8">
        <div className="flex items-center justify-between h-11">
          <div className="flex items-center">
            
            <Link to="/dashboard" className=" flex items-center justify-center space-x-2">
              <img className="w-8 rounded" src={Logo} alt="logo" />
              <span className="text-lg font-light">
                Task Manager
              </span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/dashboard" className="text-sm hover:text-gray-300 font-light  transition duration-100 ease-linear ">
              Dashboard
            </Link>
            <Link to="/tasks" className=" text-md hover:text-gray-300 font-light  transition duration-100 ease-linear ">
              Tasks
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-900 hover:bg-white hover:text-black px-4 py-1 rounded-md text-sm transition duration-150 ease-linear"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <Link
            to="/dashboard"
            className="block px-4 py-2 hover:bg-blue-500"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className="block px-4 py-2 hover:bg-blue-500"
            onClick={() => setIsOpen(false)}
          >
            Tasks
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
