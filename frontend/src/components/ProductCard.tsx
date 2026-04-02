import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}

        {/* Cart button floating over image */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute bottom-3 right-3 w-9 h-9 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
          aria-label="Add to cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-gray-900 font-semibold truncate">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-violet-700 font-bold text-lg">
            ${Number(product.price).toFixed(2)}
          </p>
          <span className="text-xs text-gray-400 hover:text-violet-600 transition-colors">
            Add to Cart
          </span>
        </div>
      </div>
    </Link>
  );
}
