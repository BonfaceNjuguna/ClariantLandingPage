import { useState } from "react";
import { useAppEntries } from "../../hooks/useAppEntries";
import AppTableRow from "./AppTableRow";
import AppTableToolbar from "./AppTableToolbar";
import Pagination from "../Shared/Pagination";
import AppFormModal from "../AppForm/AppFormModal";
import type { AppEntryInput } from "../../types/index";
import { createAppEntry } from "../../services/appService";
import { useAuth } from "../../context/AuthContext";

const AppTable = () => {
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const apps = useAppEntries(perPage, currentPage, search);

  const handleAddNew = async (data: AppEntryInput) => {
    if (!user) return;
    try {
      await createAppEntry(data, user.token);
      setShowModal(false);
      // trigger refetch manually or reload
      window.location.reload(); // or better: use a fetchApps ref callback
    } catch (err) {
      console.error("Error adding app", err);
    }
  };

  return (
    <div>
      <AppTableToolbar
        perPage={perPage}
        setPerPage={setPerPage}
        search={search}
        setSearch={setSearch}
        onAdd={() => setShowModal(true)}
      />

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Owner</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">URL</th>
            <th className="p-2 border">Port</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => <AppTableRow key={app.id} app={app} />)}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <AppFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddNew}
        initialData={null}
      />
    </div>
  );
};

export default AppTable;
