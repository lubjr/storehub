import type { Category } from '../types';

interface Props {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selected === cat.id
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
