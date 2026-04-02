import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SearchBar } from './SearchBar';

interface Props {
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function Navbar({ search, onSearchChange }: Props) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="bg-violet-600 text-white font-bold text-sm w-7 h-7 rounded flex items-center justify-center">
            S
          </span>
          <span className="font-bold text-lg tracking-tight">StoreHub</span>
        </Link>

        {/* Search — center, grows to fill available space */}
        {onSearchChange !== undefined && (
          <div className="flex-1 max-w-xl">
            <SearchBar value={search ?? ''} onChange={onSearchChange} dark />
          </div>
        )}

        {/* Spacer when no search */}
        {onSearchChange === undefined && <div className="flex-1" />}

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300 shrink-0">
          <Link to="/" className="hover:text-white transition-colors">Shop</Link>
          <span className="hover:text-white transition-colors cursor-pointer">Deals</span>
          <span className="hover:text-white transition-colors cursor-pointer">About</span>
        </nav>

        {/* Cart icon */}
        <button className="relative shrink-0 text-gray-300 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 bg-violet-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </button>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/products/new"
              className="hidden sm:block text-sm bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              + New Product
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center font-bold text-sm uppercase transition-colors"
            >
              {user?.name?.[0] ?? 'U'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}
