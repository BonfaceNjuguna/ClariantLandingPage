import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <Header />
      <h2 className="text-xl font-semibold mt-6 mb-4 flex justify-start">Welcome, {user?.name}</h2>
      {children}
    </div>
  );
};

export default DashboardLayout;
