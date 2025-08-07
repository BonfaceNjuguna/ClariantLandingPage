import clariantLogo from "../../assets/clariant-logo.svg";
import eptLogo from "../../assets/eptlogo.png"

const Header = () => (
    <div className="flex justify-between items-center border-b pb-3">
      <div />

      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col items-start">
          <img src={eptLogo} alt="EPT Logo" className="w-20 h-20 mb-1 mr-7" />
        </div>
        <div className="flex flex-col items-end">
          <img src={clariantLogo} alt="Clariant Logo" className="mb-1 mr-7" />
        </div>
      </div>
    </div>
  );

export default Header;