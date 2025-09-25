import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../utils/msalConfig";
import { useAuth } from "../context/AuthContext";
import { loginWithToken } from "../services/authService";
import clariantLogo from "../assets/clariant-logo.svg";
import eptLogo from "../assets/eptlogo.png";

const msalInstance = new PublicClientApplication(msalConfig);

export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [msalReady, setMsalReady] = useState(false);

  useEffect(() => {
    msalInstance.initialize().then(() => {
      setMsalReady(true);
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance
          .acquireTokenSilent({
            account: accounts[0],
            scopes: ["openid", "email", "profile"],
          })
          .then(async (response) => {
            const user = await loginWithToken(response.idToken, "microsoft");
            setUser(user);
            navigate("/dashboard");
          })
          .catch(() => {
            // Silent login failed, do nothing
          });
      }
    });
  }, [setUser, navigate]);

  const handleMicrosoftLogin = async () => {
    if (!msalReady) return;
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["openid", "email", "profile"],
      });

      const accessToken = loginResponse.idToken;
      const user = await loginWithToken(accessToken, "microsoft");
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      alert("Microsoft login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <div className="absolute top-8 right-8 flex flex-col items-end gap-4">
        <img
          src={clariantLogo}
          alt="Clariant Logo"
          className="h-12 w-auto"
        />
        <img src={eptLogo} alt="EPT Logo" className="h-35 w-auto" />
      </div>

      <div>
        <div className="absolute bottom-24 left-8">
          <h2 className="text-2xl font-bold text-[#003366] mb-4">
            Clariant Apps Landing Page
          </h2>
        </div>
        <div className="absolute bottom-8 left-8">
          <button
            onClick={handleMicrosoftLogin}
            className="flex items-center gap-2 px-6 py-3 bg-[#003366] text-white font-medium shadow hover:bg-[#002244] transition-colors"
          >
            <span>Login</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/4">
          <div className="relative w-96 h-72 bg-white border-2 border-gray-600 rounded-tl-3xl">
            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-48 h-8 border-2 border-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
