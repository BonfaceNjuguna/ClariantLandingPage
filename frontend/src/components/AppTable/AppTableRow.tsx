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
    <tr className={`transition hover:bg-[#D9F0FF] text-[#333332] ${className}`}>
      <td className="p-3 text-left">{app.name}</td>
      <td className="p-3 text-left">{app.owner}</td>
      <td className="p-3 text-left">{app.description}</td>
      <td className="p-3 text-left">
        <a href={app.url} target="_blank" className="text-[#003366] underline">{app.url}</a>
      </td>
      <td className="p-3 min-w-[200px] text-left">{app.comment}</td>
      <td className="p-3 text-left">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
          {app.status}
        </span>
      </td>
      <td className="p-3 text-left">
        <div className="flex gap-2">
          <button className="text-[#333332] hover:text-[#333332]" onClick={onEdit}><FaEdit /></button>
          <button className="text-red-500 hover:text-red-700" onClick={onDelete}><FaTrash /></button>
        </div>
      </td>
    </tr>
  );
};

export default AppTableRow;