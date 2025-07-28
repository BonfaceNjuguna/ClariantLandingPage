import { FaPlus } from "react-icons/fa";

const AppTableToolbar = ({
  perPage,
  setPerPage,
  search,
  setSearch,
  onAdd
}: {
  perPage: number;
  setPerPage: (v: number) => void;
  search: string;
  setSearch: (v: string) => void;
  onAdd: () => void;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-4 gap-4 text-[var(--brand-clariant-gray)]">
      <div className="flex items-center gap-2">
        <label className="text-sm">Show:</label>
        <select
          className="border px-2 py-1 rounded"
          value={perPage}
          onChange={(e) => setPerPage(parseInt(e.target.value))}
        >
          {[10, 20, 30].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <label className="text-sm">Entries</label>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-1 rounded w-64 flex justify-start text-[var(--brand-clariant-gray)]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded transition-colors"
        style={{
          backgroundColor: "var(--brand-ept-green)",
          color: "var(--brand-clariant-gray)",
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--brand-clariant-gray)";
          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--brand-ept-green)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-clariant-gray)"; 
        }}
      >
        <FaPlus /> Add New App
      </button>
    </div>
  );
};

export default AppTableToolbar;