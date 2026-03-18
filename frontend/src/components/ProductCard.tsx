import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-4">
        <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
          {product.category.name}
        </span>
        <h3 className="mt-1 text-gray-900 font-semibold truncate">{product.name}</h3>
        <p className="mt-1 text-gray-500 text-sm line-clamp-2">{product.description}</p>
        <p className="mt-3 text-lg font-bold text-gray-900">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
