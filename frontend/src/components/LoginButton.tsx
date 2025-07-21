import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { loginWithToken } from "../services/Auth";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../utils/msalConfig";
import MicrosoftLogo from '../assets/ms-symbollockup_mssymbol_19.svg';

const msalInstance = new PublicClientApplication(msalConfig);

const LoginButton = () => {
    const { setUser } = useAuth();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const token = credentialResponse.credential;
            const user = await loginWithToken(token, "google");
            setUser(user);
        } catch (err) {
            alert("Google login failed");
            console.error(err);
        }
    };

    const handleMicrosoftLogin = async () => {
        try {
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["openid", "email", "profile"],
            });

            const accessToken = loginResponse.idToken; // Azure returns ID token here
            const user = await loginWithToken(accessToken, "microsoft");
            setUser(user);
        } catch (err) {
            alert("Microsoft login failed");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google login error")} />

            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:shadow-md transition"
            >
                <img src={MicrosoftLogo} alt="Microsoft" className="w-5 h-5" />
                <span>Sign in with Microsoft</span>
            </button>
        </div>
    );
};

export default LoginButton;
