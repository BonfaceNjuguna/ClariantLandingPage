import clariantLogo from "../../assets/clariant-logo-small.svg";
import eptLogo from "../../assets/eptlogo.png"
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { setUser } = useAuth();

  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div />

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <img src={clariantLogo} alt="Clariant Logo" className="w-12 h-12 mb-1" />
          <img src={eptLogo} alt="EPT Logo" className="w-12 h-12" />
        </div>
        <button
          onClick={() => setUser(null)}
          className="text-red-600 hover:text-red-800"
          title="Logout"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>
    </div>
  );
};

export default Header;