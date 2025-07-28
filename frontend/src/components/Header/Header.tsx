import clariantLogo from "../../assets/clariant-logo-small.svg";
import eptLogo from "../../assets/eptlogo.png"

const Header = () => (
    <div className="flex justify-between items-center border-b pb-3">
      <div />

      <div className="flex items-center gap-1">
        <div className="flex flex-col items-end">
          <img src={clariantLogo} alt="Clariant Logo" className="w-5 h-5 mb-1 mr-7" />
          <img src={eptLogo} alt="EPT Logo" className="w-22 h-22 mr-6" />
        </div>
      </div>
    </div>
  );

export default Header;