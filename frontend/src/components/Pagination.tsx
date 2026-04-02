interface Props {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, onPageChange }: Props) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-violet-50 hover:border-violet-300 transition-colors"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {lastPage}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-violet-50 hover:border-violet-300 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
