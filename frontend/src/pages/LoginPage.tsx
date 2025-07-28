import logo from "../assets/clariant-logo.svg";
import LoginButton from "../components/Auth/LoginButton";

const LoginPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="w-full max-w-md border border-gray-200 p-8 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Logo" className="mb-6" />
        <h1 className="text-2xl font-bold text-black mb-1">Apps Landing Page</h1>
        <p className="text-gray-500 mb-6 text-sm">Sign in to continue</p>
      </div>
      <LoginButton />
    </div>
  </div>
);

export default LoginPage;