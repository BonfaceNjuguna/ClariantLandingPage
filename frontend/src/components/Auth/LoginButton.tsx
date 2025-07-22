import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { loginWithToken } from "../../services/authService";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../../utils/msalConfig";
import MicrosoftLogo from '../../assets/ms-symbollockup_mssymbol_19.svg';
import { useNavigate } from "react-router-dom";

const msalInstance = new PublicClientApplication(msalConfig);

const LoginButton = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    // Attempt silent Microsoft login on mount
    useEffect(() => {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.acquireTokenSilent({
                account: accounts[0],
                scopes: ["openid", "email", "profile"],
            })
            .then(async (response) => {
                const user = await loginWithToken(response.idToken, "microsoft");
                setUser(user);
                navigate("/dashboard");
            })
            .catch(() => {
                // Silent login failed, do nothing (user must click login)
            });
        }
    }, [setUser, navigate]);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const token = credentialResponse.credential;
            const user = await loginWithToken(token, "google");
            setUser(user);
            navigate("/dashboard");
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
            navigate("/dashboard");
        } catch (err) {
            alert("Microsoft login failed");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google login error")}
                // @ts-ignore
                className="transition-colors hover:bg-gray-100"
            />

            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:shadow-md transition-colors hover:bg-gray-100"
            >
                <img src={MicrosoftLogo} alt="Microsoft" className="w-5 h-5" />
                <span>Sign in with Microsoft</span>
            </button>
        </div>
    );
};

export default LoginButton;
