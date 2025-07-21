import './App.css'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import LoginButton from "./components/LoginButton";
import logo from './assets/clariant-logo-small.svg';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Apps Landing Page</h1>
          <h3 className="font-bold mb-4">Login</h3>
          <LoginButton />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

