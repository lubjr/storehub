interface Props {
  value: string;
  onChange: (value: string) => void;
  dark?: boolean;
}

export function SearchBar({ value, onChange, dark }: Props) {
  return (
    <div className="relative w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm ${
          dark
            ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
        }`}
      />
    </div>
  );
}
