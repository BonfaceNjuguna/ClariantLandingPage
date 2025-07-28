import clariantLogo from "../../assets/clariant-logo-small.svg";
import eptLogo from "../../assets/eptlogo.png"
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { setUser } = useAuth();

  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div />

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <img src={clariantLogo} alt="Clariant Logo" className="w-5 h-5 mb-1" />
          <img src={eptLogo} alt="EPT Logo" className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
};

export default Header;