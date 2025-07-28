import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import { FaSignOutAlt } from "react-icons/fa";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useAuth();

  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-between mt-6 mb-2">
        <h1 className="text-2xl font-bold ml-6 text-[var(--brand-clariant-gray)]">EPT Digital Solution Apps</h1>
        <button
          onClick={() => setUser(null)}
          className="text-[var(--brand-clariant-gray)] hover:text-[var(--brand-clariant-gray)] mr-7"
          title="Logout"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-4 flex justify-start ml-6 text-[var(--brand-clariant-gray)]">
        Welcome, {user?.name}
      </h2>
      {children}
    </div>
  );
};

export default DashboardLayout;