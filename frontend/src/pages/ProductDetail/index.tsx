import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from '../../components/Navbar';
import type { Product } from '../../types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-1">({rating})</span>
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [activeTab, setActiveTab] = useState<'specifications' | 'reviews'>('specifications');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  useEffect(() => {
    client.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await client.delete(`/products/${id}`);
      navigate('/');
    } catch {
      setDeleting(false);
      setDeleteError('Failed to delete product. Please try again.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-gray-500">Product not found.</div>;

  const colors = [
    { label: 'Classic Black', hex: '#1a1a1a' },
    { label: 'Enamel Red', hex: '#cc2200' },
  ];
  const sizes = ['10 inch', '12 inch'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-violet-600 hover:underline text-sm mb-6 inline-flex items-center gap-1"
        >
          ← Back to products
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Left — image + thumbnails */}
            <div className="md:w-1/2 p-6 flex flex-col gap-3">
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <div className="flex gap-2">
                {[product.image_url, null, null].map((thumb, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${i === 0 ? 'border-violet-500' : 'border-transparent'} bg-gray-100 flex items-center justify-center`}
                  >
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product info */}
            <div className="md:w-1/2 p-6 flex flex-col gap-4">

              {/* Header row: title + admin actions */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                  <div className="mt-1">
                    <StarRating rating={4.8} />
                  </div>
                </div>
                {isAuthenticated && (
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/products/${id}/edit`)}
                        className="text-xs px-3 py-1.5 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    {deleteError && <span className="text-xs text-red-500">{deleteError}</span>}
                  </div>
                )}
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-violet-600">
                ${Number(product.price).toFixed(2)}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>

              {/* Color */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Color</p>
                <div className="flex gap-3">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition-all ${selectedColor === i ? 'border-violet-500 text-violet-700 bg-violet-50' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Size</p>
                <div className="flex gap-2">
                  {sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(i)}
                      className={`text-sm px-4 py-1.5 rounded-lg border transition-all ${selectedSize === i ? 'border-violet-500 text-violet-700 bg-violet-50' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + Add to Cart */}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-800 min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg leading-none"
                  >
                    +
                  </button>
                </div>
                <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                  Add to Cart
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-2 border-t border-gray-100 pt-4">
                <div className="flex gap-6 border-b border-gray-100 mb-3">
                  {(['specifications', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {activeTab === 'specifications' ? (
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Category: {product.category.name}</li>
                    <li>Price: ${Number(product.price).toFixed(2)}</li>
                    <li>Available colors: {colors.map(c => c.label).join(', ')}</li>
                    <li>Available sizes: {sizes.join(', ')}</li>
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No reviews yet.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
