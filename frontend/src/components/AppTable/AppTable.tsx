import { useState } from "react";
import { useAppEntries } from "../../hooks/useAppEntries";
import AppTableRow from "./AppTableRow";
import AppTableToolbar from "./AppTableToolbar";
import Pagination from "../Shared/Pagination";
import AppFormModal from "../AppForm/AppFormModal";
import type { AppEntry, AppEntryInput } from "../../types/index";
import { createAppEntry } from "../../services/appService";
import { useAuth } from "../../context/AuthContext";
import { deleteAppEntry, updateAppEntry } from "../../services/appService";

const AppTable = () => {
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<AppEntry | null>(null);
  const { user } = useAuth();
  const { apps, total } = useAppEntries(perPage, currentPage, search);

  const handleAddNew = async (data: AppEntryInput) => {
    if (!user) return;
    try {
      await createAppEntry(data, user.token);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Error adding app", err);
    }
  };

  const handleEdit = (app: AppEntry) => {
    setEditData(app);
    setShowModal(true);
  };

  const handleUpdate = async (data: AppEntryInput) => {
    if (!user || !editData) return;
    try {
      await updateAppEntry(editData.id, data, user.token);
      setShowModal(false);
      setEditData(null);
      window.location.reload();
    } catch (err) {
      console.error("Error updating app", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this app?")) return;
    try {
      await deleteAppEntry(id, user.token);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting app", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <AppTableToolbar
        perPage={perPage}
        setPerPage={setPerPage}
        search={search}
        setSearch={setSearch}
        onAdd={() => { setEditData(null); setShowModal(true); }}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Name</th>
              <th className="p-3 font-semibold text-gray-700">Owner</th>
              <th className="p-3 font-semibold text-gray-700">Description</th>
              <th className="p-3 font-semibold text-gray-700">URL</th>
              <th className="p-3 font-semibold text-gray-700">Port</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, idx) => (
              <AppTableRow
                key={app.id}
                app={app}
                onEdit={() => handleEdit(app)}
                onDelete={() => handleDelete(app.id)}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  total={total}
  perPage={perPage}
/>

      <AppFormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditData(null); }}
        onSubmit={editData ? handleUpdate : handleAddNew}
        initialData={editData}
      />
    </div>
  );
};

export default AppTable;