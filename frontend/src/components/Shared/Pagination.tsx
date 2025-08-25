type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  total: number;
  perPage: number;
};

const Pagination = ({
  currentPage,
  setCurrentPage,
  total,
  perPage,
}: PaginationProps) => {
  const maxPage = Math.max(1, Math.ceil(total / perPage));
  const pages = Array.from({ length: maxPage }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center mt-4 gap-2">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50 text-[var(--brand-clariant-gray)] hover:bg-[var(--brand-ept-green)]"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border rounded transition
            ${
              page === currentPage
                ? "bg-[var(--brand-ept-green)] text-[var(--brand-clariant-gray)] border-[var(--brand-ept-green)]"
                : "bg-white text-[var(--brand-clariant-gray)] hover:bg-[var(--brand-ept-green)]"
            }
          `}
          onClick={() => setCurrentPage(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 border rounded disabled:opacity-50 text-[var(--brand-clariant-gray)] hover:bg-[var(--brand-ept-green)]"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= maxPage}
      >
        Next
      </button>
      <span className="ml-4 text-gray-500 text-sm">
        Page {currentPage} of {maxPage}
      </span>
    </div>
  );
};

export default Pagination;