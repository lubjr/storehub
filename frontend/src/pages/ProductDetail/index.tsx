import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import type { Product } from '../../types';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    client.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);
    try {
      await client.delete(`/products/${id}`);
      navigate('/');
    } catch {
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-gray-500">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-indigo-600 hover:underline text-sm">← Back to products</Link>
          {isAuthenticated && (
            <div className="flex gap-2">
              <Link
                to={`/products/${id}/edit`}
                className="text-sm px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full md:w-80 h-64 md:h-auto object-cover" />
          ) : (
            <div className="w-full md:w-80 h-64 bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="p-6 flex flex-col gap-3">
            <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
              {product.category.name}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-3xl font-bold text-gray-900 mt-auto">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
