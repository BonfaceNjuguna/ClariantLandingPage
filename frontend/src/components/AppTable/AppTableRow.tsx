import { FaEdit, FaTrash } from "react-icons/fa";
import type { AppEntry } from "../../types/index";

const AppTableRow = ({
  app,
  onEdit,
  onDelete,
}: {
  app: AppEntry;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <tr className="text-center">
      <td className="p-2">{app.name}</td>
      <td className="p-2">{app.owner}</td>
      <td className="p-2">{app.description}</td>
      <td className="p-2">
        <a href={app.url} target="_blank" className="text-blue-500 underline">{app.url}</a>
      </td>
      <td className="p-2">{app.port}</td>
      <td className="p-2">{app.status}</td>
      <td className="p-2">
        <div className="flex justify-center gap-2">
          <button className="text-yellow-500 hover:text-yellow-700" onClick={onEdit}><FaEdit /></button>
          <button className="text-red-600 hover:text-red-800" onClick={onDelete}><FaTrash /></button>
        </div>
      </td>
    </tr>
  );
};

export default AppTableRow;