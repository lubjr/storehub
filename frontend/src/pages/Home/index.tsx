import { useEffect, useReducer, useState } from 'react';
import client from '../../api/client';
import { ProductCard } from '../../components/ProductCard';
import { CategoryFilter } from '../../components/CategoryFilter';
import { Pagination } from '../../components/Pagination';
import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import type { Product, Category, PaginatedResponse } from '../../types';

interface ProductsState {
  loading: boolean;
  error: boolean;
  data: PaginatedResponse<Product> | null;
}

type ProductsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PaginatedResponse<Product> }
  | { type: 'FETCH_ERROR' };

function productsReducer(_state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'FETCH_START':   return { loading: true,  error: false, data: null };
    case 'FETCH_SUCCESS': return { loading: false, error: false, data: action.payload };
    case 'FETCH_ERROR':   return { loading: false, error: true,  data: null };
  }
}

export function Home() {
  const [productsState, dispatch] = useReducer(productsReducer, { loading: true, error: false, data: null });
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

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
    dispatch({ type: 'FETCH_START' });
    const params: Record<string, unknown> = { page };
    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryId) params.category = categoryId;

    client.get('/products', { params })
      .then(({ data }) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(() => dispatch({ type: 'FETCH_ERROR' }));
  }, [debouncedSearch, categoryId, page]);

  const handleCategorySelect = (id: number | null) => {
    setCategoryId(id);
    setPage(1);
  };

  const { loading, error, data: products } = productsState;

  return (
    <div className="min-h-screen bg-violet-50">
      <Navbar search={search} onSearchChange={setSearch} />
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
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
