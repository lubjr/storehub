import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';
import { CategoryFilter } from '../../components/CategoryFilter';
import { Pagination } from '../../components/Pagination';
import { useAuth } from '../../hooks/useAuth';
import type { Product, Category, PaginatedResponse } from '../../types';

export function Home() {
  const { isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    client.get('/categories').then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const params: Record<string, unknown> = { page };
    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryId) params.category = categoryId;

    client.get('/products', { params })
      .then(({ data }) => setProducts(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [debouncedSearch, categoryId, page]);

  const handleCategorySelect = (id: number | null) => {
    setCategoryId(id);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">StoreHub</h1>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/products/new"
                  className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                >
                  + New Product
                </Link>
                <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray:900">Login</Link>
                <Link to="/register" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter categories={categories} selected={categoryId} onSelect={handleCategorySelect} />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            Failed to load products. Please try again.
          </div>
        ) : products && products.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={products.meta.current_page}
                lastPage={products.meta.last_page}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-500">No products found.</div>
        )}
      </main>
    </div>
  );
}
