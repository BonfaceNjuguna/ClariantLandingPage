const Pagination = ({ currentPage, setCurrentPage }: {
  currentPage: number,
  setCurrentPage: (page: number) => void
}) => (
  <div className="flex justify-center mt-4 gap-4">
    <button
      className="px-3 py-1 border rounded"
      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
    >Prev</button>
    <span>Page {currentPage}</span>
    <button
      className="px-3 py-1 border rounded"
      onClick={() => setCurrentPage(currentPage + 1)}
    >Next</button>
  </div>
);

export default Pagination;