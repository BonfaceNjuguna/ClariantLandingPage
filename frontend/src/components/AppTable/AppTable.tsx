import { useState, useEffect } from "react";
import { useAppEntries } from "../../hooks/useAppEntries";
import { useSearchParams } from "react-router-dom";
import AppTableRow from "./AppTableRow";
import AppTableToolbar from "./AppTableToolbar";
import Pagination from "../Shared/Pagination";
import AppFormModal from "../AppForm/AppFormModal";
import type { AppEntry, AppEntryInput } from "../../types/index";
import { createAppEntry } from "../../services/appService";
import { useAuth } from "../../context/AuthContext";
import { deleteAppEntry, updateAppEntry } from "../../services/appService";

const AppTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<AppEntry | null>(null);
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { apps, total } = useAppEntries(perPage, currentPage, search, status, sortBy, sortOrder);

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

  useEffect(() => {
    setSearchParams(params => {
      params.set("page", String(currentPage));
      return params;
    });
  }, [currentPage, setSearchParams]);

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

  const handleSortName = () => {
    setSortBy("name");
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
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

    <div className="flex justify-end gap-2 mb-4 items-end">
      {["", "Active", "Inactive"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          className={`px-4 py-1 rounded-full border transition
            ${
              status === s
                ? s === "Active"
                  ? "bg-green-100 text-green-700 border-green-300 font-semibold"
                  : s === "Inactive"
                  ? "bg-gray-200 text-gray-700 border-gray-400 font-semibold"
                  : "bg-[var(--brand-ept-green)] text-[var(--brand-clariant-gray)] border-[var(--brand-ept-green)] font-semibold"
                : "bg-white text-[var(--brand-clariant-gray)] hover:bg-[var(--brand-ept-green)]"
            }
          `}
        >
          {s === "" ? "All" : s}
        </button>
      ))}
    </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th
                className="p-3 font-semibold text-[var(--brand-clariant-gray)] text-left cursor-pointer select-none"
                onClick={handleSortName}
              >
                Name
                <span className="ml-1">
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              </th>              
              <th className="p-3 font-semibold text-[var(--brand-clariant-gray)] text-left">Owner</th>
              <th className="p-3 font-semibold text-[var(--brand-clariant-gray)] text-left">Description</th>
              <th className="p-3 font-semibold text-[var(--brand-clariant-gray)] text-left">URL</th>
              <th className="p-3 font-semibold text-[var(--brand-clariant-gray)] min-w-[200px] text-left">Comment</th>
              <th className="p-3 font-semibold text-[var(--brand-clariant-gray)] text-left">Status</th>
              <th className="p-3 font-semibold text-[var(--brand-clariant-gray)] text-left">Actions</th>
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