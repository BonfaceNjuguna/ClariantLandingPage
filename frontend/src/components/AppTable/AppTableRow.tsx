import { FaEdit, FaTrash } from "react-icons/fa";
import type { AppEntry } from "../../types/index";

const AppTableRow = ({
  app,
  onEdit,
  onDelete,
  className = "",
}: {
  app: AppEntry;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}) => {
  return (
    <tr className={`text-center transition hover:bg-blue-50 ${className}`}>
      <td className="p-3">{app.name}</td>
      <td className="p-3">{app.owner}</td>
      <td className="p-3">{app.description}</td>
      <td className="p-3">
        <a href={app.url} target="_blank" className="text-blue-500 underline">{app.url}</a>
      </td>
      <td className="p-3">{app.port}</td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
          {app.status}
        </span>
      </td>
      <td className="p-3">
        <div className="flex justify-center gap-2">
          <button className="text-yellow-500 hover:text-yellow-700" onClick={onEdit}><FaEdit /></button>
          <button className="text-red-600 hover:text-red-800" onClick={onDelete}><FaTrash /></button>
        </div>
      </td>
    </tr>
  );
};

export default AppTableRow;