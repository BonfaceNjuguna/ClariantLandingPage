import logo from "../../assets/clariant-logo-small.svg";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { setUser } = useAuth();

  return (
    <div className="flex justify-between items-center border-b pb-3">
      <img src={logo} alt="Logo" className="w-12 h-12" />
      <button onClick={() => setUser(null)} className="text-red-600 hover:text-red-800">
        <FaSignOutAlt size={24} />
      </button>
    </div>
  );
};

export default Header;
