import { FaEdit, FaTrash } from "react-icons/fa";
import type { AppEntry } from "../../types/index";

const AppTableRow = ({ app }: { app: AppEntry }) => {
  return (
    <tr>
      <td className="p-2 border">{app.name}</td>
      <td className="p-2 border">{app.owner}</td>
      <td className="p-2 border">{app.description}</td>
      <td className="p-2 border">
        <a href={app.url} target="_blank" className="text-blue-500 underline">{app.url}</a>
      </td>
      <td className="p-2 border">{app.port}</td>
      <td className="p-2 border">{app.status}</td>
      <td className="p-2 border flex gap-2">
        <button className="text-yellow-500 hover:text-yellow-700"><FaEdit /></button>
        <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
      </td>
    </tr>
  );
};

export default AppTableRow;